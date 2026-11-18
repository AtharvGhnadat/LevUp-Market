import {
  ArrowRight,
  ClipboardList,
  Code2,
  FileSearch,
  Package,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Fragment } from "react";
import { Container } from "@/components/ui/Container";

const readyMadeSteps = [
  {
    icon: Search,
    title: "Explore Projects",
    body: "Browse our catalog of ready-made engineering projects.",
  },
  {
    icon: ShoppingCart,
    title: "Choose Package",
    body: "Select the package tier that fits your requirements.",
  },
  {
    icon: Package,
    title: "Secure Checkout",
    body: "Complete your order with safe, verified payment.",
  },
  {
    icon: Truck,
    title: "Receive Delivery",
    body: "Get your project files and any hardware shipped to you.",
  },
];

const customSteps = [
  {
    icon: ClipboardList,
    title: "Submit Requirements",
    body: "Describe your project needs, timeline and specifications.",
  },
  {
    icon: FileSearch,
    title: "Review Quotation",
    body: "Receive a detailed plan, timeline and cost breakdown.",
  },
  {
    icon: Code2,
    title: "Track Development",
    body: "Follow milestone updates as your project is built and tested.",
  },
  {
    icon: Truck,
    title: "Receive Project",
    body: "Get the completed project with source code, docs and revisions.",
  },
];

function StepRow({ steps, label }: { steps: typeof readyMadeSteps; label: string }) {
  return (
    <div>
      <h3 className="mb-6 text-center font-display text-base font-bold text-alloy sm:text-lg">
        {label}
      </h3>
      <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:flex lg:items-start lg:justify-between lg:gap-3">
        {steps.map((step, idx) => (
          <Fragment key={step.title}>
            <li className="flex flex-1 flex-col items-center text-center">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-volt-tint text-volt-action shadow-xs">
                <step.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <h4 className="mt-4 font-display text-base font-bold text-alloy">
                {idx + 1}. {step.title}
              </h4>
              <p className="mt-1.5 max-w-[210px] font-sans text-xs leading-relaxed text-muted sm:text-sm">
                {step.body}
              </p>
            </li>
            {idx < steps.length - 1 && (
              <div
                aria-hidden="true"
                className="hidden self-center lg:flex items-center justify-center pt-2 text-muted/40"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
              </div>
            )}
          </Fragment>
        ))}
      </ol>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-24 py-10 sm:py-14">
      <Container>
        <div className="flex items-center justify-center gap-3">
          <span className="h-0.5 w-6 bg-volt-action" aria-hidden="true" />
          <h2
            id="how-title"
            className="font-display text-2xl font-extrabold text-alloy sm:text-3xl"
          >
            How LevUp Projects Works
          </h2>
          <span className="h-0.5 w-6 bg-volt-action" aria-hidden="true" />
        </div>
        <p className="mt-2 text-center font-sans text-sm text-muted sm:text-base">
          Two clear paths from idea to delivery.
        </p>

        <div className="mt-10 space-y-12">
          <StepRow steps={readyMadeSteps} label="Ready-Made Projects" />
          <div className="mx-auto h-px w-24 bg-line" aria-hidden="true" />
          <StepRow steps={customSteps} label="Custom Development" />
        </div>
      </Container>
    </section>
  );
}
