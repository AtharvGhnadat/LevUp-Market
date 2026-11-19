import { useCallback, useState } from "react";
import { categories } from "@/data/categories";
import { to } from "@/lib/routes";
import {
  DataView,
  EmptyState,
  RouteRow,
  SectionTitle,
  TextLink,
} from "@/components/workspace/WorkspaceUI";
import { Field, SettingsForm } from "@/components/workspace/SettingsForm";
import { dateLabel, isPurchased, statusLabel, ticketTopics, type Order } from "@/workspace/model";
import {
  markRepliesRead,
  createTicket,
  loadOrder,
  loadOrders,
  loadProfile,
  loadProjects,
  loadReplies,
  loadRequests,
  loadTickets,
} from "@/workspace/repository";
import { useCustomerData } from "@/workspace/use-customer-data";
import { ProfileChecklist } from "./CustomerSettings";

function orderUrl(id: string) {
  return "/dashboard/orders?" + new URLSearchParams({ order: id });
}
const money = (order: Order) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: order.currency,
    minimumFractionDigits: 0,
  }).format(order.total_paise / 100);
function OrderRow({ order }: { order: Order }) {
  return (
    <RouteRow
      href={orderUrl(order.id)}
      title={order.order_items[0]?.projects?.title ?? "Order " + order.id}
      detail={statusLabel(order.status) + " · " + dateLabel(order.created_at)}
      meta={money(order)}
    />
  );
}
export function Overview({ owner }: { owner: string }) {
  const profile = useCustomerData(owner, loadProfile),
    projects = useCustomerData(owner, loadProjects),
    requests = useCustomerData(owner, loadRequests),
    messages = useCustomerData(owner, loadReplies);
  return (
    <div className="overview-grid">
      <div className="min-w-0 space-y-8">
        <section>
          <SectionTitle>Recent orders</SectionTitle>
          <DataView {...projects}>
            {({ orders, files }) =>
              orders.length ? (
                <>
                  <div className="workspace-list">
                    {orders.slice(0, 3).map((order) => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </div>
                  {files.length > 0 && (
                    <TextLink href="/dashboard/projects">
                      View available deliverables ({files.length})
                    </TextLink>
                  )}
                </>
              ) : (
                <EmptyState
                  title="Start with a project"
                  href="/projects"
                  action="Browse the catalog"
                >
                  Your order history and delivery progress will appear here after an order is
                  recorded.
                </EmptyState>
              )
            }
          </DataView>
        </section>
        <section>
          <SectionTitle>Custom requests</SectionTitle>
          <DataView {...requests}>
            {(rows) =>
              rows.length ? (
                <RouteRow
                  href="/dashboard/custom-requests"
                  title={rows[0].title}
                  detail={statusLabel(rows[0].status)}
                />
              ) : (
                <TextLink href="/custom-project">Prepare your first engineering brief</TextLink>
              )
            }
          </DataView>
        </section>
        <section>
          <SectionTitle>Support updates</SectionTitle>
          <DataView {...messages}>
            {(rows) =>
              rows.length ? (
                <RouteRow
                  href="/dashboard/messages"
                  title={rows[0].customer_tickets.subject}
                  detail={"Reply received " + dateLabel(rows[0].created_at)}
                />
              ) : (
                <p className="text-sm text-muted">
                  You have no support replies.{" "}
                  <a href={to("/dashboard/support")} className="underline">
                    Visit support
                  </a>
                </p>
              )
            }
          </DataView>
        </section>
      </div>
      <aside className="min-w-0">
        <DataView {...profile}>
          {(p) => (
            <>
              <ProfileChecklist profile={p} />
              {p.preferred_categories.length > 0 && (
                <section className="mt-5">
                  <SectionTitle>Your categories</SectionTitle>
                  {categories
                    .filter((c) => p.preferred_categories.includes(c.slug))
                    .map((c) => (
                      <RouteRow key={c.slug} href={"/projects?category=" + c.slug} title={c.name} />
                    ))}
                </section>
              )}
            </>
          )}
        </DataView>
      </aside>
    </div>
  );
}
export function CustomerOrders({ owner, id }: { owner: string; id: string | null }) {
  return id ? <OrderDetail owner={owner} id={id} /> : <OrderHistory owner={owner} />;
}
function OrderHistory({ owner }: { owner: string }) {
  const orders = useCustomerData(owner, loadOrders);
  return (
    <DataView {...orders}>
      {(rows) =>
        rows.length ? (
          <div className="workspace-list">
            {rows.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
        ) : (
          <EmptyState title="No orders yet" href="/projects" action="Explore projects">
            When you place an order, its package, amount and status will appear here.
          </EmptyState>
        )
      }
    </DataView>
  );
}
function OrderDetail({ owner, id }: { owner: string; id: string }) {
  const fetchOrder = useCallback((user: string) => loadOrder(user, id), [id]);
  const order = useCustomerData(owner, fetchOrder);
  return (
    <>
      <TextLink href="/dashboard/orders">Back to orders</TextLink>
      <DataView {...order}>
        {(o) =>
          o ? (
            <>
              <div className="identity-summary">
                <span className="field-label">Order reference</span>
                <strong className="font-mono text-base wrap-anywhere">{o.id}</strong>
                <p>
                  {dateLabel(o.created_at)} · {statusLabel(o.status)} · {money(o)}
                </p>
              </div>
              <SectionTitle>Project packages</SectionTitle>
              {o.order_items.length ? (
                o.order_items.map((item) => (
                  <p key={item.id} className="workspace-row">
                    {item.projects?.title ?? item.project_id}
                    <span className="text-sm">{item.package_name}</span>
                  </p>
                ))
              ) : (
                <p className="text-muted">This order has no recorded packages.</p>
              )}
              <TextLink href="/dashboard/support">Get order support</TextLink>
            </>
          ) : (
            <EmptyState title="Order unavailable" href="/dashboard/orders" action="View my orders">
              This order could not be found in your workspace.
            </EmptyState>
          )
        }
      </DataView>
    </>
  );
}
export function CustomerProjects({ owner }: { owner: string }) {
  const query = useCustomerData(owner, loadProjects);
  return (
    <DataView {...query}>
      {({ orders, files }) => {
        const purchased = orders.filter(isPurchased);
        return (
          <>
            {purchased.length || files.length ? (
              <>
                {purchased.map((o) => (
                  <section className="mb-5" key={o.id}>
                    <SectionTitle>{statusLabel(o.status)}</SectionTitle>
                    {o.order_items.map((item) => (
                      <RouteRow
                        key={item.id}
                        title={item.projects?.title ?? item.project_id}
                        detail={item.package_name + " package · Order " + o.id}
                        href={orderUrl(o.id)}
                      />
                    ))}
                  </section>
                ))}
                {files.length > 0 && (
                  <section>
                    <SectionTitle>Assigned deliverables</SectionTitle>
                    {files.map((f) => (
                      <RouteRow
                        key={f.id}
                        href={orderUrl(f.order_id)}
                        title={f.file_name}
                        detail={"Order " + f.order_id}
                      />
                    ))}
                    <p className="text-sm text-muted">Contact support for file delivery.</p>
                  </section>
                )}
              </>
            ) : (
              <EmptyState title="No assigned projects yet" href="/projects" action="Find a project">
                Purchased packages and assigned files appear here when your order is confirmed.
              </EmptyState>
            )}
          </>
        );
      }}
    </DataView>
  );
}
export function CustomerRequests({ owner }: { owner: string }) {
  const query = useCustomerData(owner, loadRequests);
  return (
    <>
      <a href={to("/custom-project")} className="workspace-action">
        Prepare a custom brief
      </a>
      <DataView {...query}>
        {(rows) =>
          rows.length ? (
            <ul className="workspace-list mt-4">
              {rows.map((r) => (
                <li key={r.id} className="workspace-row">
                  <div className="min-w-0">
                    <h2 className="font-display font-semibold wrap-anywhere">{r.title}</h2>
                    <p className="mt-1 text-sm text-muted">
                      {r.category} · {dateLabel(r.created_at)}
                    </p>
                  </div>
                  <span className="text-sm text-muted">{statusLabel(r.status)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No submitted briefs">
              Submit a reviewed specification from the custom development page. Local drafts stay on
              the device where you started them.
            </EmptyState>
          )
        }
      </DataView>
    </>
  );
}
export function CustomerMessages({ owner }: { owner: string }) {
  const query = useCustomerData(owner, loadReplies);
  const [busy, setBusy] = useState(false),
    [failed, setFailed] = useState(false);
  async function read(ids: string[]) {
    setBusy(true);
    setFailed(false);
    try {
      await markRepliesRead(ids);
      query.retry();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <DataView {...query}>
      {(rows) =>
        rows.length ? (
          <>
            {rows.some((m) => !m.customer_reply_reads.length) && (
              <button
                className="workspace-link"
                disabled={busy}
                onClick={() =>
                  void read(rows.filter((m) => !m.customer_reply_reads.length).map((m) => m.id))
                }
              >
                {busy ? "Updating…" : "Mark messages as read"}
              </button>
            )}
            {failed && (
              <p className="form-error" role="alert">
                Couldn’t mark messages as read. Try again.
              </p>
            )}
            <ul className="workspace-list">
              {rows.map((m) => (
                <li key={m.id} className="py-4">
                  <h2 className="font-display font-semibold">{m.customer_tickets.subject}</h2>
                  <p className="mt-1 text-xs text-muted">
                    LevUp support · {dateLabel(m.created_at)}
                  </p>
                  <p className="mt-3 whitespace-pre-line wrap-anywhere">{m.body}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState title="No replies yet" href="/dashboard/support" action="Open support">
            Replies to your support requests will appear here.
          </EmptyState>
        )
      }
    </DataView>
  );
}
export function CustomerSupport({ owner }: { owner: string }) {
  const query = useCustomerData(owner, loadTickets);
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const [confirmation, setConfirmation] = useState("");
  const deletion = new URLSearchParams(window.location.search).get("topic") === "deletion";
  return (
    <div className="space-y-8">
      <section>
        <SectionTitle>{deletion ? "Request account deletion" : "New support request"}</SectionTitle>
        {confirmation && (
          <p className="form-confirmation" role="status">
            {confirmation}
          </p>
        )}
        <SettingsForm
          key={requestId}
          saveLabel="Send request"
          onSave={async (f) => {
            await createTicket(
              requestId,
              String(f.get("topic")),
              String(f.get("subject")).trim(),
              String(f.get("body")).trim(),
            );
            setConfirmation("Your request was recorded. Replies will appear in Messages.");
            setRequestId(crypto.randomUUID());
            query.retry();
          }}
        >
          <label className="field-label">
            Topic
            <select
              name="topic"
              className="workspace-input"
              defaultValue={deletion ? "Account deletion" : "Account"}
            >
              {ticketTopics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <Field
            label="Subject"
            name="subject"
            required
            minLength={3}
            maxLength={120}
            defaultValue={deletion ? "Account deletion review" : ""}
          />
          <label className="field-label">
            How can we help?
            <textarea
              name="body"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              className="workspace-input"
            />
          </label>
          {deletion && (
            <p className="text-sm text-muted">
              This sends a request for an ownership and retention review. Your account stays active
              during review.
            </p>
          )}
        </SettingsForm>
      </section>
      <section>
        <SectionTitle>Your support requests</SectionTitle>
        <DataView {...query}>
          {(rows) =>
            rows.length ? (
              <ul className="workspace-list">
                {rows.map((t) => (
                  <li key={t.id}>
                    <details className="border-b border-line py-2">
                      <summary className="min-h-11 cursor-pointer content-center font-medium wrap-anywhere">
                        {t.subject} · {statusLabel(t.status)}
                      </summary>
                      <p className="text-sm text-muted">
                        {dateLabel(t.created_at)} · {t.topic}
                      </p>
                      <p className="mt-2 whitespace-pre-line wrap-anywhere">{t.body}</p>
                    </details>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">You haven’t opened a support request.</p>
            )
          }
        </DataView>
      </section>
    </div>
  );
}
