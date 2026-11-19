import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { categories } from "@/data/categories";
import { useAuth } from "@/auth/auth-context";
import { getSupabaseClient } from "@/lib/supabase";
import { to } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Choices, Field, SettingsForm } from "@/components/workspace/SettingsForm";
import { DataView, RouteRow, SectionTitle, TextLink } from "@/components/workspace/WorkspaceUI";
import {
  academicFields,
  classifications,
  domains,
  personalFields,
  preferenceFields,
  profileCompletion,
  type CustomerProfile,
} from "@/workspace/model";
import { settingsLinks } from "@/workspace/navigation";
import { loadProfile, saveProfile } from "@/workspace/repository";
import { useCustomerData } from "@/workspace/use-customer-data";

export function SettingsHome({ user }: { user: User }) {
  const { signOut, signOutPending, signOutError } = useAuth();
  return (
    <>
      <div className="identity-summary">
        <span className="field-label">Signed in as</span>
        <strong className="block text-lg wrap-anywhere">{user.email}</strong>
        <span className="text-sm text-success">Email verified</span>
      </div>
      <div className="workspace-list">
        {settingsLinks.map((link) => (
          <RouteRow key={link.href} href={link.href} title={link.label} detail={link.description} />
        ))}
      </div>
      <button
        type="button"
        className="workspace-link mt-3"
        disabled={signOutPending}
        onClick={() => void signOut()}
      >
        {signOutPending ? "Signing out…" : "Sign Out"}
      </button>
      {signOutError && (
        <p className="form-error" role="alert">
          {signOutError}
        </p>
      )}
    </>
  );
}

function ProfileEditor({ user, profile }: { user: User; profile: CustomerProfile }) {
  return (
    <SettingsForm
      onSave={async (form) => {
        const saved = await saveProfile(user.id, personalFields(form));
        window.dispatchEvent(
          new CustomEvent("levup:profile-name", {
            detail: { id: user.id, name: saved.display_name || saved.full_name },
          }),
        );
      }}
    >
      <div className="settings-grid">
        <Field
          name="full_name"
          label="Full name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={profile.full_name}
          autoComplete="name"
        />
        <Field
          name="display_name"
          label="Display name (optional)"
          maxLength={60}
          defaultValue={profile.display_name ?? ""}
          autoComplete="nickname"
          hint="Shown in your account menu."
        />
      </div>
      <Field
        name="phone_number"
        label="Phone number (optional)"
        type="tel"
        autoComplete="tel"
        maxLength={22}
        defaultValue={profile.phone_number ?? ""}
      />
      <div className="border-t border-line pt-4">
        <span className="field-label">Sign-in email</span>
        <p className="wrap-anywhere">{user.email}</p>
        <span className="text-sm font-medium text-success">Email verified</span>
      </div>
    </SettingsForm>
  );
}
function AcademicEditor({ profile }: { profile: CustomerProfile }) {
  return (
    <SettingsForm
      onSave={async (form) => {
        await saveProfile(profile.id, academicFields(form));
      }}
    >
      <label className="field-label">
        Account classification
        <select
          name="account_class"
          defaultValue={profile.account_class ?? ""}
          className="workspace-input"
        >
          <option value="">Prefer not to specify</option>
          {classifications.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <div className="settings-grid">
        <Field
          name="college_name"
          label="College or institution"
          maxLength={140}
          autoComplete="organization"
          defaultValue={profile.college_name ?? ""}
        />
        <Field
          name="qualification"
          label="Degree or qualification"
          maxLength={100}
          defaultValue={profile.qualification ?? ""}
        />
        <Field
          name="degree_branch"
          label="Branch or department"
          maxLength={120}
          defaultValue={profile.degree_branch ?? ""}
        />
        <Field
          name="study_year"
          label="Current year of study"
          type="number"
          min={1}
          max={8}
          defaultValue={profile.study_year ?? ""}
        />
        <Field
          name="graduation_year"
          label="Expected graduation year"
          type="number"
          min={1950}
          max={2150}
          defaultValue={profile.graduation_year ?? ""}
        />
      </div>
      <Choices
        name="project_domains"
        legend="Preferred project domains"
        options={domains.map((d) => ({ value: d, label: d }))}
        selected={profile.project_domains}
      />
      <div className="settings-grid">
        <Field
          name="technical_interests"
          label="Technical interests"
          maxLength={300}
          defaultValue={profile.technical_interests ?? ""}
          hint="For example, autonomous systems or signal processing."
        />
        <Field
          name="technology_interests"
          label="Tools and technologies"
          maxLength={300}
          defaultValue={profile.technology_interests ?? ""}
          hint="For example, Python, ESP32 or KiCad."
        />
      </div>
    </SettingsForm>
  );
}
export function ProfileSettings({
  user,
  section,
}: {
  user: User;
  section: "profile" | "academic" | "preferences";
}) {
  const query = useCustomerData(user.id, loadProfile);
  return (
    <DataView {...query}>
      {(profile) =>
        section === "profile" ? (
          <ProfileEditor user={user} profile={profile} />
        ) : section === "academic" ? (
          <AcademicEditor profile={profile} />
        ) : (
          <SettingsForm
            onSave={async (form) => {
              await saveProfile(user.id, preferenceFields(form));
            }}
          >
            <Choices
              name="preferred_categories"
              legend="Categories on your workspace overview"
              options={categories.map((c) => ({ value: c.slug, label: c.name }))}
              selected={profile.preferred_categories}
            />
          </SettingsForm>
        )
      }
    </DataView>
  );
}
export function ProfileChecklist({ profile }: { profile: CustomerProfile }) {
  const { filled, total } = profileCompletion(profile);
  return (
    <section className="profile-checklist">
      <h2 className="font-display text-xl font-semibold">Your profile</h2>
      <p className="mt-2 text-sm text-muted">
        {filled} of {total} profile details added
      </p>
      <progress
        value={filled}
        max={total}
        aria-label="Profile completion"
        className="my-3 block h-1.5 w-full accent-alloy"
      />
      <TextLink href="/account/profile">Edit personal details</TextLink>
      <TextLink href="/account/academic">
        {profile.account_class ? "Edit academic details" : "Add academic details"}
      </TextLink>
    </section>
  );
}
export function SecuritySettings({ user }: { user: User }) {
  const { signOut, signOutError, signOutPending } = useAuth();
  const [pending, setPending] = useState(false),
    [result, setResult] = useState<"ok" | "error" | null>(null);
  async function otherSessions() {
    setPending(true);
    setResult(null);
    try {
      const { error } = await getSupabaseClient().auth.signOut({ scope: "others" });
      if (error) throw error;
      setResult("ok");
    } catch {
      setResult("error");
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="settings-sections">
      <section>
        <SectionTitle>Password and email</SectionTitle>
        <p className="text-sm text-muted">Email verified</p>
        <strong className="block wrap-anywhere">{user.email}</strong>
        <p className="mt-2 max-w-prose text-sm text-muted">
          A recovery link sent to this address lets you choose a new password.
        </p>
        <TextLink href="/forgot-password">Reset password</TextLink>
      </section>
      <section>
        <SectionTitle>Sessions</SectionTitle>
        {user.last_sign_in_at && (
          <p className="mb-3 text-sm text-muted">
            Last sign-in recorded by Supabase on{" "}
            {new Date(user.last_sign_in_at).toLocaleDateString("en-IN", { dateStyle: "long" })}.
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            disabled={pending || signOutPending}
            onClick={() => void otherSessions()}
          >
            {pending ? "Signing out…" : "Sign out of other sessions"}
          </Button>
          <Button variant="ink" disabled={pending || signOutPending} onClick={() => void signOut()}>
            {signOutPending ? "Signing out…" : "Sign Out"}
          </Button>
        </div>
        {result === "ok" && (
          <p className="form-confirmation" role="status">
            Other sessions can no longer refresh. Previously issued access tokens expire on their
            normal schedule.
          </p>
        )}
        {(result === "error" || signOutError) && (
          <p className="form-error" role="alert">
            {signOutError || "We couldn’t sign out the other sessions. Try again."}
          </p>
        )}
      </section>
      <section>
        <SectionTitle>Account deletion</SectionTitle>
        <p className="max-w-prose text-sm leading-relaxed text-muted">
          Request a review of your account and personal data. The team must verify ownership and
          check order and financial record retention before deletion.
        </p>
        <a className="workspace-link" href={to("/dashboard/support?topic=deletion")}>
          Request account deletion
        </a>
      </section>
    </div>
  );
}
