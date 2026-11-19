import type { Page } from "@playwright/test";
import {
  assumeCustomer,
  migrateTestDatabase,
  testDatabase,
} from "../test-support/customer-database.ts";
export const customerId = "e8000000-0000-4000-8000-000000000001";
const writable: Record<string, string[]> = {
  profiles: [
    "full_name",
    "display_name",
    "phone_number",
    "college_name",
    "degree_branch",
    "account_class",
    "qualification",
    "study_year",
    "graduation_year",
    "technical_interests",
    "technology_interests",
    "project_domains",
    "preferred_categories",
    "default_address_id",
  ],
  customer_addresses: [
    "id",
    "recipient",
    "phone",
    "line1",
    "line2",
    "landmark",
    "city",
    "region",
    "pin",
  ],
  customer_requests: ["id", "title", "category", "specification"],
  customer_tickets: ["id", "topic", "subject", "body"],
  customer_reply_reads: ["reply_id"],
};
const readers: Record<string, string> = {
  customer_reply_reads: "select * from customer_reply_reads",
  profiles: "select * from profiles",
  customer_addresses: "select * from customer_addresses",
  customer_tickets: "select * from customer_tickets",
  customer_requests: "select * from customer_requests",
  orders: `select o.id,o.status,o.currency,o.total_paise,o.created_at,o.user_id,coalesce((select jsonb_agg(jsonb_build_object('id',i.id,'project_id',i.project_id,'package_name',i.package_name,'projects',(select jsonb_build_object('title',p.title,'slug',p.slug) from projects p where p.id=i.project_id))) from order_items i where i.order_id=o.id),'[]'::jsonb) order_items from orders o`,
  deliverable_entitlements:
    "select id,user_id,order_id,file_name,is_active from deliverable_entitlements",
  customer_support_replies:
    "select r.id,r.body,r.created_at,t.user_id,coalesce((select jsonb_agg(jsonb_build_object('reply_id',rr.reply_id)) from customer_reply_reads rr where rr.reply_id=r.id),'[]'::jsonb) customer_reply_reads,jsonb_build_object('id',t.id,'subject',t.subject) customer_tickets from customer_support_replies r join customer_tickets t on t.id=r.ticket_id",
};

export async function workspaceFixture(
  page: Page,
  { withActivity = false, name = "Sample Student" } = {},
) {
  const db = testDatabase();
  await migrateTestDatabase(db);
  await db.query(
    "insert into auth.users(id,email,raw_user_meta_data) values($1,'student@example.invalid',$2)",
    [customerId, JSON.stringify({ full_name: name })],
  );
  if (withActivity) {
    await db.exec(
      `insert into projects(id,slug,title,summary,category_id,project_type,delivery_type,difficulty,starting_price_paise,is_published) values ('LP-1001','esp32-smart-irrigation-system','ESP32 Smart Irrigation System','Lab fixture','cat-iot','built-on-order','hybrid','intermediate',649900,true);`,
    );
    await db.query(
      "insert into orders(id,user_id,status,subtotal_paise,total_paise) values('LU-2036',$1,'in_progress',649900,649900)",
      [customerId],
    );
    await db.exec(
      "insert into order_items(order_id,project_id,package_name,package_price_paise,item_total_paise) values('LU-2036','LP-1001','Standard',649900,649900)",
    );
    await db.query(
      "insert into deliverable_entitlements(user_id,order_id,storage_path,file_name,file_type,file_size_bytes) values($1,'LU-2036','test-private','Circuit diagram.pdf','application/pdf',512)",
      [customerId],
    );
    await db.query(
      "update profiles set account_class='Student',college_name='Example Institute of Technology',degree_branch='Electronics engineering',qualification='BEng',study_year=3,graduation_year=2028,project_domains=ARRAY['IoT','Robotics'],preferred_categories=ARRAY['iot-electronics'] where id=$1",
      [customerId],
    );
    await db.query(
      "insert into customer_addresses(user_id,recipient,phone,line1,city,region,pin) values($1,$2,'9000000000','12 Example Campus Road','Pune','Maharashtra','411001')",
      [customerId, name],
    );
    await db.query(
      "insert into customer_tickets(id,user_id,topic,subject,body) values('cd000000-0000-4000-8000-000000000003',$1,'Order or project','Kit assembly guide','Where can I find the assembly guide?')",
      [customerId],
    );
    await db.exec(
      "insert into customer_support_replies(ticket_id,body) values('cd000000-0000-4000-8000-000000000003','Your circuit diagram is listed under My projects.')",
    );
  }
  await assumeCustomer(db, customerId);
  let rejectWrite = false;
  await page.route("**/__auth-fixture/rest/v1/**", async (route) => {
    const request = route.request(),
      url = new URL(request.url()),
      table = url.pathname.split("/").pop() ?? "";
    if (
      !Object.hasOwn(readers, table) ||
      !request.headers().authorization?.endsWith(".synthetic-signature")
    )
      return route.fulfill({ status: 403, json: { message: "Fixture access denied" } });
    const method = request.method();
    if (rejectWrite && method !== "GET")
      return route.fulfill({ status: 503, json: { message: "Fixture unavailable" } });
    try {
      const id = url.searchParams.get("id")?.replace(/^eq\./, "");
      const filter = id ? " where id=$1" : "";
      let rows: Record<string, unknown>[];
      if (table === "customer_reply_reads" && method === "POST") {
        const receipts = request.postDataJSON() as { reply_id: string }[];
        for (const { reply_id } of receipts)
          await db.query(
            "insert into customer_reply_reads(reply_id) values($1) on conflict(user_id,reply_id) do nothing",
            [reply_id],
          );
        return route.fulfill({ status: 201, body: "" });
      }
      if (method === "GET") {
        rows = (
          await db.query(
            readers[table] +
              filter +
              ([
                "orders",
                "customer_tickets",
                "customer_requests",
                "customer_support_replies",
              ].includes(table)
                ? " order by created_at desc"
                : ""),
            id ? [id] : [],
          )
        ).rows;
      } else if (method === "DELETE" && table === "customer_addresses" && id) {
        rows = (await db.query("delete from customer_addresses where id=$1 returning id", [id]))
          .rows;
      } else {
        const payload = request.postDataJSON(),
          keys = Object.keys(payload);
        if (
          !keys.length ||
          !keys.every((k) => writable[table]?.includes(k)) ||
          !(method === "POST" || (id && method === "PATCH"))
        )
          throw new Error("Unsupported fixture operation");
        const values = keys.map((k) =>
          k === "specification" ? JSON.stringify(payload[k]) : payload[k],
        );
        const params = keys.map((_, i) => "$" + (i + 1));
        const sql =
          method === "POST"
            ? "insert into " +
              table +
              " (" +
              keys.join(",") +
              ") values (" +
              params.join(",") +
              ") returning *"
            : "update " +
              table +
              " set " +
              keys.map((k, i) => k + "=" + params[i]).join(",") +
              " where id=$" +
              (keys.length + 1) +
              " returning *";
        if (method === "PATCH") values.push(id);
        rows = (await db.query(sql, values)).rows;
      }
      if (method === "GET" && url.searchParams.get("customer_reply_reads") === "is.null")
        rows = rows.filter(
          (row) => Array.isArray(row.customer_reply_reads) && row.customer_reply_reads.length === 0,
        );
      const one = request.headers().accept?.includes("vnd.pgrst.object");
      if (one && rows.length !== 1)
        return route.fulfill({
          status: 406,
          json: { code: "PGRST116", message: "Expected one record" },
        });
      return route.fulfill({ status: method === "POST" ? 201 : 200, json: one ? rows[0] : rows });
    } catch (error) {
      return route.fulfill({
        status: 400,
        json: {
          code: (error as { code?: string }).code ?? "fixture_failure",
          message: "Fixture query failed",
        },
      });
    }
  });
  return {
    db,
    failWrites: (value: boolean) => {
      rejectWrite = value;
    },
    close: () => db.close(),
  };
}
