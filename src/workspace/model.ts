import { categories } from "@/data/categories";

export const domains = [
  "AI/ML",
  "Web development",
  "Mobile applications",
  "IoT",
  "Embedded systems",
  "Electronics",
  "Robotics",
  "Automation",
  "Digital design",
] as const;
export const classifications = ["Student", "Professional", "Other"] as const;
export const ticketTopics = [
  "Account",
  "Order or project",
  "Custom request",
  "Account deletion",
  "Other",
] as const;

export type CustomerProfile = {
  id: string;
  full_name: string;
  display_name: string | null;
  phone_number: string | null;
  college_name: string | null;
  degree_branch: string | null;
  account_class: string | null;
  qualification: string | null;
  study_year: number | null;
  graduation_year: number | null;
  technical_interests: string | null;
  technology_interests: string | null;
  project_domains: string[];
  preferred_categories: string[];
  default_address_id: string | null;
};
export type Address = {
  id: string;
  recipient: string;
  phone: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  region: string;
  pin: string;
  country: string;
};
export type Order = {
  id: string;
  status: string;
  total_paise: number;
  currency: string;
  created_at: string;
  order_items: {
    id: string;
    project_id: string;
    package_name: string;
    projects: { title: string; slug: string } | null;
  }[];
};
export type Entitlement = { id: string; order_id: string; file_name: string };
export type CustomerRequest = {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
};
export type Ticket = {
  id: string;
  topic: string;
  subject: string;
  body: string;
  status: string;
  created_at: string;
};
export type Reply = {
  id: string;
  body: string;
  created_at: string;
  customer_tickets: { id: string; subject: string };
  customer_reply_reads: { reply_id: string }[];
};

const field = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const optional = (form: FormData, key: string) => field(form, key) || null;
function choices(form: FormData, key: string, options: readonly string[]) {
  const values = [...new Set(form.getAll(key).map(String))];
  if (values.some((value) => !options.includes(value))) throw new Error("Choose a listed option.");
  return values;
}
function year(form: FormData, key: string, min: number, max: number) {
  const value = optional(form, key);
  if (value === null) return null;
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max)
    throw new Error("Check the year and try again.");
  return number;
}
export function personalFields(form: FormData) {
  const full_name = field(form, "full_name");
  if (full_name.length < 2 || full_name.length > 80)
    throw new Error("Use a name between 2 and 80 characters.");
  const phone_number = optional(form, "phone_number");
  if (phone_number && !/^\+?[\d ()-]{7,22}$/.test(phone_number))
    throw new Error("Check the phone number.");
  return { full_name, display_name: optional(form, "display_name"), phone_number };
}
export function academicFields(form: FormData) {
  const account_class = optional(form, "account_class");
  if (account_class && !classifications.some((x) => x === account_class))
    throw new Error("Choose a listed classification.");
  return {
    account_class,
    college_name: optional(form, "college_name"),
    degree_branch: optional(form, "degree_branch"),
    qualification: optional(form, "qualification"),
    study_year: year(form, "study_year", 1, 8),
    graduation_year: year(form, "graduation_year", 1950, 2150),
    technical_interests: optional(form, "technical_interests"),
    technology_interests: optional(form, "technology_interests"),
    project_domains: choices(form, "project_domains", domains),
  };
}
export function preferenceFields(form: FormData) {
  return {
    preferred_categories: choices(
      form,
      "preferred_categories",
      categories.map((c) => c.slug),
    ),
  };
}
export function addressFields(form: FormData) {
  const phone = field(form, "phone");
  const pin = field(form, "pin");
  if (!/^\d{10}$/.test(phone) || !/^[1-9]\d{5}$/.test(pin))
    throw new Error("Check the 10-digit mobile number and 6-digit PIN.");
  return {
    recipient: field(form, "recipient"),
    phone,
    line1: field(form, "line1"),
    line2: optional(form, "line2"),
    landmark: optional(form, "landmark"),
    city: field(form, "city"),
    region: field(form, "region"),
    pin,
  };
}
export const orderStatuses: Record<string, string> = {
  draft: "Draft",
  pending_payment: "Awaiting payment",
  paid: "Paid",
  in_progress: "In development",
  qa_review: "Quality review",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
  submitted: "Submitted",
  feasibility_review: "Feasibility review",
  quotation_ready: "Quotation ready",
  in_development: "In development",
  completed: "Completed",
  closed: "Closed",
  received: "Received",
  in_review: "In review",
};
export function statusLabel(status: string) {
  return orderStatuses[status] ?? "Status unavailable";
}
export function isPurchased(order: Order) {
  return ["paid", "in_progress", "qa_review", "shipped", "delivered"].includes(order.status);
}
export function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
export function profileCompletion(profile: CustomerProfile) {
  const fields = [Boolean(profile.full_name?.trim()), Boolean(profile.account_class)];
  if (profile.account_class === "Student")
    fields.push(
      Boolean(profile.college_name?.trim()),
      Boolean(profile.degree_branch?.trim()),
      Boolean(profile.graduation_year),
    );
  return { filled: fields.filter(Boolean).length, total: fields.length };
}
