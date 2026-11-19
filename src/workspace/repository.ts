import { getSupabaseClient } from "@/lib/supabase";
import type {
  Address,
  CustomerProfile,
  Order,
  Entitlement,
  CustomerRequest,
  Ticket,
  Reply,
} from "./model";
import type { CustomProjectFormState } from "@/custom-project/custom-project-state";
import { buildSpecificationExport } from "@/custom-project/custom-project-state";
const profileColumns =
  "id,full_name,display_name,phone_number,college_name,degree_branch,account_class,qualification,study_year,graduation_year,technical_interests,technology_interests,project_domains,preferred_categories,default_address_id";
const addressColumns = "id,recipient,phone,line1,line2,landmark,city,region,pin,country";
const orderColumns =
  "id,status,total_paise,currency,created_at,order_items(id,project_id,package_name,projects(title,slug))";
const ticketColumns = "id,topic,subject,body,status,created_at";

function data<T>(result: { data: T | null; error: unknown }): T {
  if (result.error || result.data === null) throw new Error("Account service unavailable.");
  return result.data;
}
export async function loadProfile(owner: string): Promise<CustomerProfile> {
  return data(
    await getSupabaseClient().from("profiles").select(profileColumns).eq("id", owner).single(),
  );
}
type ProfileChanges = Partial<Omit<CustomerProfile, "id">>;
export async function saveProfile(owner: string, changes: ProfileChanges) {
  return data(
    await getSupabaseClient()
      .from("profiles")
      .update(changes)
      .eq("id", owner)
      .select(profileColumns)
      .single(),
  ) as CustomerProfile;
}
export async function loadAddresses(owner: string) {
  const db = getSupabaseClient();
  const [rows, profile] = await Promise.all([
    db.from("customer_addresses").select(addressColumns).eq("user_id", owner).order("created_at"),
    db.from("profiles").select("default_address_id").eq("id", owner).single(),
  ]);
  return {
    addresses: data(rows) as Address[],
    defaultId: data(profile).default_address_id as string | null,
  };
}
export async function saveAddress(
  owner: string,
  values: Omit<Address, "id" | "country">,
  id: string,
  existing: boolean,
) {
  const table = getSupabaseClient().from("customer_addresses");
  const query = existing
    ? table.update(values).eq("id", id).eq("user_id", owner)
    : table.insert({ id, ...values });
  const result = await query.select(addressColumns).single();
  if (!existing && result.error?.code === "23505")
    return data(
      await table.update(values).eq("user_id", owner).eq("id", id).select(addressColumns).single(),
    ) as Address;
  return data(result) as Address;
}
export async function deleteAddress(owner: string, id: string) {
  data(
    await getSupabaseClient()
      .from("customer_addresses")
      .delete()
      .eq("user_id", owner)
      .eq("id", id)
      .select("id")
      .single(),
  );
}
export async function loadOrders(owner: string): Promise<Order[]> {
  return data(
    await getSupabaseClient()
      .from("orders")
      .select(orderColumns)
      .eq("user_id", owner)
      .order("created_at", { ascending: false })
      .returns<Order[]>(),
  );
}
export async function loadOrder(owner: string, orderId: string): Promise<Order | null> {
  const result = await getSupabaseClient()
    .from("orders")
    .select(orderColumns)
    .eq("user_id", owner)
    .eq("id", orderId)
    .maybeSingle()
    .overrideTypes<Order, { merge: false }>();
  if (result.error) throw new Error("Order unavailable.");
  return result.data;
}
export async function loadEntitlements(owner: string): Promise<Entitlement[]> {
  return data(
    await getSupabaseClient()
      .from("deliverable_entitlements")
      .select("id,order_id,file_name")
      .eq("user_id", owner)
      .eq("is_active", true),
  );
}
export async function loadProjects(owner: string) {
  const [orders, files] = await Promise.all([loadOrders(owner), loadEntitlements(owner)]);
  return { orders, files };
}
export async function loadRequests(owner: string): Promise<CustomerRequest[]> {
  return data(
    await getSupabaseClient()
      .from("customer_requests")
      .select("id,title,category,status,created_at")
      .eq("user_id", owner)
      .order("created_at", { ascending: false }),
  );
}
export async function submitBrief(form: CustomProjectFormState, id: string) {
  const { project } = buildSpecificationExport(form, []);
  const { title, category, stagedReferenceFiles, ...specification } = project;
  void stagedReferenceFiles;
  const result = await getSupabaseClient()
    .from("customer_requests")
    .insert({ id, title, category, specification })
    .select("id")
    .single();
  if (result.error?.code === "23505")
    return data(
      await getSupabaseClient().from("customer_requests").select("id").eq("id", id).single(),
    );
  return data(result);
}
export async function loadTickets(owner: string): Promise<Ticket[]> {
  return data(
    await getSupabaseClient()
      .from("customer_tickets")
      .select(ticketColumns)
      .eq("user_id", owner)
      .order("created_at", { ascending: false }),
  );
}
export async function createTicket(id: string, topic: string, subject: string, body: string) {
  const db = getSupabaseClient();
  const result = await db
    .from("customer_tickets")
    .insert({ id, topic, subject, body })
    .select("id")
    .single();
  if (result.error?.code === "23505")
    return data(await db.from("customer_tickets").select("id").eq("id", id).single());
  return data(result);
}
export async function loadReplies(owner: string): Promise<Reply[]> {
  return data(
    await getSupabaseClient()
      .from("customer_support_replies")
      .select(
        "id,body,created_at,customer_tickets!inner(id,subject),customer_reply_reads(reply_id)",
      )
      .eq("customer_tickets.user_id", owner)
      .order("created_at", { ascending: false })
      .returns<Reply[]>(),
  );
}
export async function hasUnreadReplies(owner: string) {
  const result = await getSupabaseClient()
    .from("customer_support_replies")
    .select("id,customer_tickets!inner(user_id),customer_reply_reads(reply_id)")
    .eq("customer_tickets.user_id", owner)
    .is("customer_reply_reads", "null")
    .limit(1);
  return data(result).length > 0;
}
export async function markRepliesRead(ids: string[]) {
  const result = await getSupabaseClient()
    .from("customer_reply_reads")
    .upsert(
      ids.map((reply_id) => ({ reply_id })),
      { onConflict: "user_id,reply_id", ignoreDuplicates: true },
    );
  if (result.error) throw new Error("Could not update read receipts.");
  window.dispatchEvent(new Event("levup:inbox-changed"));
}
