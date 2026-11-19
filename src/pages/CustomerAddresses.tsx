import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, SettingsForm } from "@/components/workspace/SettingsForm";
import { DataView, EmptyState } from "@/components/workspace/WorkspaceUI";
import { addressFields, type Address } from "@/workspace/model";
import { deleteAddress, loadAddresses, saveAddress, saveProfile } from "@/workspace/repository";
import { useCustomerData } from "@/workspace/use-customer-data";
import { to } from "@/lib/routes";

function AddressForm({
  owner,
  address,
  onSaved,
}: {
  owner: string;
  address?: Address;
  onSaved: () => void;
}) {
  const [id] = useState(() => address?.id ?? crypto.randomUUID());
  return (
    <>
      <h2 className="workspace-section-title">
        {address ? "Edit address" : "New delivery address"}
      </h2>
      <SettingsForm
        saveLabel="Save address"
        onSave={async (f) => {
          await saveAddress(owner, addressFields(f), id, Boolean(address));
          onSaved();
        }}
      >
        <div className="settings-grid">
          <Field
            label="Recipient name"
            name="recipient"
            autoComplete="shipping name"
            minLength={2}
            maxLength={80}
            required
            defaultValue={address?.recipient}
          />
          <Field
            label="Mobile number"
            name="phone"
            autoComplete="shipping tel-national"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            required
            hint="10 digits"
            defaultValue={address?.phone}
          />
        </div>
        <Field
          label="Street address"
          name="line1"
          autoComplete="shipping address-line1"
          minLength={4}
          maxLength={160}
          required
          defaultValue={address?.line1}
        />
        <div className="settings-grid">
          <Field
            label="Apartment or building (optional)"
            name="line2"
            autoComplete="shipping address-line2"
            maxLength={160}
            defaultValue={address?.line2 ?? ""}
          />
          <Field
            label="Landmark (optional)"
            name="landmark"
            maxLength={120}
            defaultValue={address?.landmark ?? ""}
          />
          <Field
            label="City"
            name="city"
            autoComplete="shipping address-level2"
            minLength={2}
            maxLength={80}
            required
            defaultValue={address?.city}
          />
          <Field
            label="State or union territory"
            name="region"
            autoComplete="shipping address-level1"
            minLength={2}
            maxLength={80}
            required
            defaultValue={address?.region}
          />
          <Field
            label="PIN code"
            name="pin"
            autoComplete="shipping postal-code"
            inputMode="numeric"
            pattern="[1-9][0-9]{5}"
            maxLength={6}
            required
            defaultValue={address?.pin}
          />
          <div>
            <span className="field-label">Country</span>
            <p className="py-3">India</p>
          </div>
        </div>
      </SettingsForm>
      <a href={to("/account/addresses")} className="workspace-link">
        Back to saved addresses
      </a>
    </>
  );
}
export function CustomerAddresses({ owner }: { owner: string }) {
  const query = useCustomerData(owner, loadAddresses);
  const [deleting, setDeleting] = useState(""),
    [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(""),
    [failed, setFailed] = useState(false);
  const [edit, setEdit] = useState(
    () => new URLSearchParams(window.location.search).get("edit") ?? "",
  );
  async function action(fn: () => Promise<unknown>, message: string) {
    if (busy) return;
    setBusy(true);
    setNotice("");
    try {
      await fn();
      setDeleting("");
      setFailed(false);
      setNotice(message);
      query.retry();
    } catch {
      setFailed(true);
      setNotice("We couldn’t update this address. Try again.");
    } finally {
      setBusy(false);
    }
  }
  function saved() {
    history.replaceState(history.state, "", to("/account/addresses"));
    setEdit("");
    setFailed(false);
    setNotice("Address saved.");
    query.retry();
  }
  return (
    <>
      {notice && (
        <p
          role={failed ? "alert" : "status"}
          className={failed ? "form-error" : "form-confirmation"}
        >
          {notice}
        </p>
      )}
      <DataView {...query}>
        {({ addresses, defaultId }) => {
          const address = addresses.find((a) => a.id === edit);
          if (edit === "new" || address)
            return <AddressForm owner={owner} address={address} onSaved={saved} />;
          return (
            <>
              <a className="workspace-action" href={to("/account/addresses?edit=new")}>
                Add delivery address
              </a>
              {addresses.length === 0 ? (
                <EmptyState title="No saved addresses">
                  Add an Indian delivery address when you need a physical kit.
                </EmptyState>
              ) : (
                <ul className="mt-4 divide-y divide-line">
                  {addresses.map((a) => (
                    <li key={a.id} className="py-4">
                      <h2 className="font-display text-lg font-semibold">{a.recipient}</h2>
                      {a.id === defaultId && (
                        <p className="text-sm font-semibold text-success">
                          Default delivery address
                        </p>
                      )}
                      <address className="mt-2 text-sm leading-relaxed break-words text-muted not-italic">
                        {[a.line1, a.line2, a.landmark, a.city, a.region, a.pin, "India"]
                          .filter(Boolean)
                          .join(", ")}
                        <br />
                        {a.phone}
                      </address>
                      <div className="flex flex-wrap items-center gap-x-5">
                        <a href={to("/account/addresses?edit=" + a.id)} className="workspace-link">
                          Edit address
                        </a>
                        {a.id !== defaultId && (
                          <button
                            className="workspace-link"
                            disabled={busy}
                            onClick={() =>
                              void action(
                                () => saveProfile(owner, { default_address_id: a.id }),
                                "Default address updated.",
                              )
                            }
                          >
                            Make default
                          </button>
                        )}
                        <button
                          className="workspace-link"
                          disabled={busy}
                          onClick={() => setDeleting(a.id)}
                        >
                          Remove
                        </button>
                      </div>
                      {deleting === a.id && (
                        <div className="workspace-feedback">
                          <p>Remove this delivery address?</p>
                          <div className="flex gap-4">
                            <Button
                              variant="outline"
                              disabled={busy}
                              onClick={() =>
                                void action(() => deleteAddress(owner, a.id), "Address removed.")
                              }
                            >
                              Confirm removal
                            </Button>
                            <button className="workspace-link" onClick={() => setDeleting("")}>
                              Keep address
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          );
        }}
      </DataView>
    </>
  );
}
