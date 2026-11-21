// @vitest-environment node
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import {
  testDatabase,
  migrateTestDatabase,
  assumeCustomer,
} from "../../test-support/customer-database";

const alice = "ad000000-0000-4000-8000-000000000001";
const bob = "bd000000-0000-4000-8000-000000000002";
const db = testDatabase();
const customer = (id: string) => assumeCustomer(db, id);
async function addAddress(name: string) {
  const result = await db.query<{ id: string }>(
    "insert into customer_addresses(recipient,phone,line1,city,region,pin) values($1,'9876543210','Lab Road','Pune','Maharashtra','411001') returning id",
    [name],
  );
  return result.rows[0].id;
}
beforeAll(async () => {
  await migrateTestDatabase(db);
  await db.query(
    "insert into auth.users(id,email) values($1,'one@example.invalid'),($2,'two@example.invalid')",
    [alice, bob],
  );
}, 30000);
afterAll(async () => {
  await db.close();
});
describe("customer database migrations and RLS", () => {
  it("persists personal and academic changes for the owner and isolates identities", async () => {
    await customer(alice);
    await db.query(
      "update profiles set full_name='Test Student',account_class='Student',study_year=3,college_name='Test Institute' where id=$1",
      [alice],
    );
    expect((await db.query("select full_name,study_year from profiles")).rows).toEqual([
      { full_name: "Test Student", study_year: 3 },
    ]);
    await expect(
      db.query("update profiles set study_year=12 where id=$1", [alice]),
    ).rejects.toThrow();
    await customer(bob);
    expect(
      (await db.query("update profiles set study_year=1 where id=$1 returning id", [alice])).rows,
    ).toEqual([]);
    await expect(
      db.query("update profiles set email='x@example.invalid' where id=$1", [bob]),
    ).rejects.toThrow();
  });
  it("only permits an owned default address and clears it atomically on deletion", async () => {
    await customer(alice);
    const address = await addAddress("Alice Sample");
    await db.query("update profiles set default_address_id=$1 where id=$2", [address, alice]);
    await customer(bob);
    expect((await db.query("select id from customer_addresses")).rows).toEqual([]);
    expect(
      (await db.query("delete from customer_addresses where id=$1 returning id", [address])).rows,
    ).toEqual([]);
    await expect(
      db.query("update profiles set default_address_id=$1 where id=$2", [address, bob]),
    ).rejects.toThrow();
    await customer(alice);
    await db.query("delete from customer_addresses where id=$1", [address]);
    expect((await db.query("select default_address_id from profiles")).rows).toEqual([
      { default_address_id: null },
    ]);
  });
  it("keeps intake, replies and workflow statuses private", async () => {
    await customer(alice);
    const result = await db.query<{ id: string }>(
      "insert into customer_tickets(topic,subject,body) values('Account','Profile help','Please review this test case.') returning id",
    );
    const id = result.rows[0].id;
    await expect(
      db.query("update customer_tickets set status='closed' where id=$1", [id]),
    ).rejects.toThrow();
    await db.exec("reset role");
    await db.query(
      "insert into customer_support_replies(ticket_id,body) values($1,'An isolated test reply')",
      [id],
    );
    const replies = await db.query<{ id: string }>("select id from customer_support_replies");
    await customer(bob);
    await expect(
      db.query("insert into customer_reply_reads(reply_id) values($1)", [replies.rows[0].id]),
    ).rejects.toThrow();
    expect((await db.query("select id from customer_tickets")).rows).toEqual([]);
    expect((await db.query("select id from customer_support_replies")).rows).toEqual([]);
    await customer(alice);
    expect((await db.query("select body from customer_support_replies")).rows).toHaveLength(1);
    await db.query(
      "insert into customer_reply_reads(reply_id) values($1) on conflict(user_id,reply_id) do nothing",
      [replies.rows[0].id],
    );
    expect((await db.query("select * from customer_reply_reads")).rows).toHaveLength(1);
    await db.exec("reset role; set role anon");
    await expect(db.query("select * from customer_addresses")).rejects.toThrow();
  });
  it("accepts a complete brief and limits its visibility and the customer’s writable columns", async () => {
    await customer(alice);
    const specification = JSON.stringify({
      classification: "hardware",
      requirements: "A sufficiently detailed requirement for a bench test",
      expectedFunctionality: "Measure the test signal",
      deliverables: ["Report"],
    });
    await db.query(
      "insert into customer_requests(title,category,specification) values('Bench signal test','Electronics',$1)",
      [specification],
    );
    expect((await db.query("select status from customer_requests")).rows).toEqual([
      { status: "submitted" },
    ]);
    await expect(db.query("update customer_requests set status='completed'")).rejects.toThrow();
    await customer(bob);
    expect((await db.query("select title from customer_requests")).rows).toEqual([]);
  });
});
