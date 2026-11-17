import { ArrowRight, Code2, FileText, Layers, Package } from "lucide-react";
import { Fragment } from "react";
import { Container } from "@/components/ui/Container";

const steps = [
  {
    num: "1",
    icon: FileText,
    title: "1. Choose or Request",
    body: "Explore ready projects or submit your requirement.",
  },
  {
    num: "2",
    icon: Layers,
    title: "2. Get a Plan & Quote",
    body: "Receive a detailed plan, timeline and cost.",
  },
  {
    num: "3",
    icon: Code2,
    title: "3. Development",
    body: "We build, test and share progress updates.",
  },
  {
    num: "4",
    icon: Package,
    title: "4. Deliver & Support",
    body: "Get the final project with source code, docs and revisions.",
  },
];

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
          A simple and transparent process from idea to delivery.
        </p>

        <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:flex lg:items-start lg:justify-between lg:gap-3">
          {steps.map((step, idx) => (
            <Fragment key={step.title}>
              <li className="flex flex-1 flex-col items-center text-center">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F9ECE5] text-volt-action shadow-xs">
                  <step.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-alloy">{step.title}</h3>
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
      </Container>
    </section>
  );
}
