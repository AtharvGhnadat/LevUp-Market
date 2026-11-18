import { ArrowRight, Calendar, FileText, Settings } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { to } from "@/lib/routes";

const highlights = [
  {
    icon: Settings,
    label: "Project Design & Development",
  },
  {
    icon: Calendar,
    label: "Milestone-Based Progress",
  },
  {
    icon: FileText,
    label: "Full Documentation & Support",
  },
];

export function CustomProjectBanner() {
  return (
    <section id="custom" aria-labelledby="custom-title" className="scroll-mt-24 py-8 sm:py-10">
      <Container>
        <div className="rounded-2xl bg-alloy p-6 text-white shadow-card sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left: Headline & Subtitle */}
            <div className="lg:col-span-5">
              <h2
                id="custom-title"
                className="font-display text-2xl font-semibold leading-tight tracking-[-0.015em] sm:text-3xl"
              >
                Have a <span className="text-volt">Custom Project</span> in Mind?
              </h2>
              <p className="mt-2 font-sans text-xs leading-relaxed text-muted-on-alloy sm:text-sm">
                Share your idea or requirement and get a tailored solution with a plan, timeline and
                quotation.
              </p>
            </div>

            {/* Middle: 3 Pillars with icons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:col-span-4 lg:justify-center lg:gap-6">
              {highlights.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-left">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-volt">
                    <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="font-sans text-xs font-medium leading-tight text-white/90">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Right: CTA button */}
            <div className="flex sm:justify-start lg:col-span-3 lg:justify-end">
              <ButtonLink
                href={to("/custom-project")}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-6"
              >
                Request Custom Project
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
