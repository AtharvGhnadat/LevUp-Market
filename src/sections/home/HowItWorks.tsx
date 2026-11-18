import {
  ClipboardList,
  Code2,
  FileSearch,
  Package,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

const readyMadeSteps = [
  {
    code: "01",
    icon: Search,
    title: "Explore Projects",
    body: "Browse documented ready-made engineering projects by domain, stack, and delivery mode.",
  },
  {
    code: "02",
    icon: ShoppingCart,
    title: "Choose Package",
    body: "Select the package tier and eligible add-ons matching your deliverables and support needs.",
  },
  {
    code: "03",
    icon: Package,
    title: "Secure Checkout",
    body: "Complete your order via verified Cashfree payment with transparent package totals.",
  },
  {
    code: "04",
    icon: Truck,
    title: "Receive Delivery",
    body: "Access digital files immediately or track physical hardware shipment to your address.",
  },
];

const customSteps = [
  {
    code: "01",
    icon: ClipboardList,
    title: "Submit Requirements",
    body: "Share your technical specifications, preferred stack, target deadline, and delivery scope.",
  },
  {
    code: "02",
    icon: FileSearch,
    title: "Review Quotation",
    body: "Receive an engineering feasibility review with a clear plan, timeline, and formal quote.",
  },
  {
    code: "03",
    icon: Code2,
    title: "Track Development",
    body: "Follow verified build milestones as software, circuits, or integrated hardware are tested.",
  },
  {
    code: "04",
    icon: Truck,
    title: "Receive Project",
    body: "Take handover of your completed project with documentation, source files, and support.",
  },
];

type JourneyTrackProps = {
  steps: typeof readyMadeSteps;
  label: string;
  subtitle: string;
  tag: string;
  accent?: boolean;
};

/**
 * The LevUp Assembly Spine — continuous hairline progression rail with
 * numbered caliper nodes tracing each engineering fulfillment path.
 */
function AssemblySpineTrack({ steps, label, subtitle, tag, accent = false }: JourneyTrackProps) {
  return (
    <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col gap-1 border-b border-line pb-4 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-alloy">{label}</h3>
          <p className="mt-0.5 font-sans text-xs text-muted sm:text-sm">{subtitle}</p>
        </div>
        <span className="font-mono text-xs font-medium text-muted tabular-nums">{tag}</span>
      </div>

      <ol className="relative mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* Continuous Assembly Spine rail on desktop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-5 right-12 left-12 hidden h-px bg-line lg:block"
        />

        {steps.map((step, idx) => (
          <li key={step.title} className="relative flex flex-col">
            <div className="flex items-center gap-3">
              <span
                className={
                  accent
                    ? "relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-volt-action/25 bg-volt-tint text-volt-text"
                    : "relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-mineral text-alloy"
                }
              >
                <step.icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <span className="relative z-10 bg-white pr-3 font-mono text-xs font-medium text-muted tabular-nums">
                Step {step.code}
              </span>
            </div>

            <h4 className="mt-4 font-display text-base font-semibold text-alloy">
              {idx + 1}. {step.title}
            </h4>
            <p className="mt-1.5 font-sans text-xs leading-relaxed text-muted sm:text-sm">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-24 py-12 sm:py-16">
      <Container>
        <div className="max-w-2xl">
          <h2
            id="how-title"
            className="font-display text-2xl font-semibold tracking-[-0.015em] text-alloy sm:text-3xl"
          >
            How LevUp Projects Works
          </h2>
          <p className="mt-2 font-sans text-sm leading-relaxed text-muted sm:text-base">
            Order a ready-made engineering project directly, or commission a custom build tracked
            through structured milestones.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <AssemblySpineTrack
            steps={readyMadeSteps}
            label="Ready-Made Projects"
            subtitle="Direct catalog selection with configurable packages and immediate or shipped delivery"
            tag="Direct path · 01–04"
          />
          <AssemblySpineTrack
            steps={customSteps}
            label="Custom Development"
            subtitle="Tailored software, embedded, IoT, or hardware builds scoped by quotation"
            tag="Milestone path · 01–04"
            accent
          />
        </div>
      </Container>
    </section>
  );
}
