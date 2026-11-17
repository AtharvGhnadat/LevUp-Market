import { CheckCircle2, Info } from "lucide-react";
import type { ProjectPackage } from "@/data/project-details";

export function RevisionEntitlement({ selectedPackage }: { selectedPackage: ProjectPackage }) {
  return (
    <div className="rounded-sm border border-line bg-paper px-3 py-3">
      <div className="flex items-start gap-2">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-success" />
        <div>
          <p className="text-[0.75rem] font-semibold text-ink">
            {selectedPackage.freeRevisions} eligible free{" "}
            {selectedPackage.freeRevisions === 1 ? "revision" : "revisions"} ·{" "}
            {selectedPackage.revisionWindowDays}-day request window
          </p>
          <p className="mt-1 text-[0.6875rem] leading-relaxed text-muted">
            Includes {selectedPackage.supportDays} days of package support. Out-of-scope changes
            require a new quotation.
          </p>
        </div>
      </div>
      <p className="mt-2 flex gap-2 border-t border-line pt-2 text-[0.625rem] leading-relaxed text-muted">
        <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Confirmed defects against accepted scope are remediation obligations and do not
        automatically consume a free revision. Paid revisions remain in order history.
      </p>
    </div>
  );
}
