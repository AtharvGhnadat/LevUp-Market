export const workspaceLinks = [
  {
    href: "/dashboard",
    label: "Overview",
    description: "Your engineering projects, requests and next steps.",
  },
  {
    href: "/dashboard/projects",
    label: "My projects",
    description: "Purchased project packages and the deliverables assigned to you.",
  },
  {
    href: "/dashboard/custom-requests",
    label: "Custom requests",
    description: "Follow the briefs you have submitted for engineering review.",
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    description: "Review your order history, project packages and delivery status.",
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    description: "Read replies to the support requests you have opened.",
  },
  {
    href: "/dashboard/support",
    label: "Support",
    description: "Ask about your account, an order or a custom engineering request.",
  },
];
export const settingsLinks = [
  {
    href: "/account/profile",
    label: "Personal profile",
    description: "Your name, optional phone number and verified email.",
  },
  {
    href: "/account/academic",
    label: "Academic profile",
    description:
      "Add your institution, study details and engineering interests when they are relevant to you.",
  },
  {
    href: "/account/security",
    label: "Account security",
    description: "Manage your password, sessions and account access.",
  },
  {
    href: "/account/addresses",
    label: "Delivery addresses",
    description: "Private delivery details for physical hardware shipments in India.",
  },
  {
    href: "/account/preferences",
    label: "Preferences",
    description: "Choose the project categories you want to find quickly in your workspace.",
  },
];
export const accountLink = {
  href: "/account",
  label: "Account settings",
  description: "Manage your personal details, studies and account access.",
};

export function accountName(value: unknown) {
  return typeof value === "string" && value.trim() && !value.includes("@")
    ? value.trim()
    : "Customer";
}
export function initials(name: string) {
  const words = name.trim().split(/\s+/u);
  return [words[0], words.length > 1 ? words[words.length - 1] : ""]
    .map((word) => Array.from(word)[0] ?? "")
    .join("")
    .toLocaleUpperCase();
}
export const customerRoutes = [...workspaceLinks, accountLink, ...settingsLinks];
