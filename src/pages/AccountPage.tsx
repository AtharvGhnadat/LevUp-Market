import type { User } from "@supabase/supabase-js";
import { CustomerWorkspaceLayout } from "@/components/workspace/CustomerWorkspaceLayout";
import { customerRoutes } from "@/workspace/navigation";
import { CustomerAddresses } from "./CustomerAddresses";
import { ProfileSettings, SecuritySettings, SettingsHome } from "./CustomerSettings";
import {
  CustomerMessages,
  CustomerOrders,
  CustomerProjects,
  CustomerRequests,
  CustomerSupport,
  Overview,
} from "./CustomerWork";

const pages: Record<string, (user: User) => React.ReactNode> = {
  "/dashboard": (u) => <Overview owner={u.id} />,
  "/dashboard/orders": (u) => (
    <CustomerOrders owner={u.id} id={new URLSearchParams(window.location.search).get("order")} />
  ),
  "/dashboard/projects": (u) => <CustomerProjects owner={u.id} />,
  "/dashboard/custom-requests": (u) => <CustomerRequests owner={u.id} />,
  "/dashboard/messages": (u) => <CustomerMessages owner={u.id} />,
  "/dashboard/support": (u) => <CustomerSupport owner={u.id} />,
  "/account": (u) => <SettingsHome user={u} />,
  "/account/profile": (u) => <ProfileSettings user={u} section="profile" />,
  "/account/academic": (u) => <ProfileSettings user={u} section="academic" />,
  "/account/preferences": (u) => <ProfileSettings user={u} section="preferences" />,
  "/account/security": (u) => <SecuritySettings user={u} />,
  "/account/addresses": (u) => <CustomerAddresses owner={u.id} />,
};
export function AccountPage({ path }: { path: string }) {
  const route = customerRoutes.find((item) => item.href === path);
  if (!route) return null;
  const orderDetail =
    path === "/dashboard/orders" && new URLSearchParams(window.location.search).has("order");
  return (
    <CustomerWorkspaceLayout
      path={path}
      title={orderDetail ? "Order details" : route.label}
      description={route.description}
    >
      {pages[path]}
    </CustomerWorkspaceLayout>
  );
}
