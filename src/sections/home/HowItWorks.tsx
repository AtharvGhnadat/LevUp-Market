import type { LucideIcon } from "lucide-react";
import { Box, ChevronRight, CreditCard, Search, Settings, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const steps: Array<{ icon: LucideIcon; title: string; body: [string, string] }> = [
  {
    icon: Search,
    title: "Discover or Request",
    body: ["Choose a ready-made project", "or submit your requirements."],
  },
  {
    icon: SlidersHorizontal,
    title: "Configure & Get a Quote",
    body: ["Select a package, add-ons or", "receive a custom quotation."],
  },
  {
    icon: CreditCard,
    title: "Make Payment",
    body: ["Pay securely — full, milestone", "or advance + balance."],
  },
  {
    icon: Settings,
    title: "Development & Updates",
    body: ["Track progress, share feedback", "and manage revisions."],
  },
  {
    icon: Box,
    title: "Receive & Review",
    body: ["Get digital files or hardware", "delivered and finalize the order."],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-24 pt-6 pb-8">
      <Container>
        <Eyebrow align="center" className="text-[0.625rem]">
          How It Works
        </Eyebrow>
        <h2
          id="how-title"
          className="mt-1.5 text-center font-display text-[1.75rem] leading-tight font-extrabold tracking-[-0.02em] text-ink"
        >
          A Simple &amp; Transparent Process
        </h2>
        <p className="mt-1.5 text-center text-[0.75rem] text-ink/80">
          From project selection to final delivery, we keep it clear, structured and hassle-free.
        </p>

        <ol className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="relative lg:pr-4">
              <div className="flex items-center gap-[21px]">
                <span className="inline-flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full bg-copper-action font-display text-[0.75rem] font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon aria-hidden="true" className="h-[30px] w-[30px] text-ink" strokeWidth={1.5} />
              </div>
              <h3 className="mt-2 font-display text-[0.875rem] font-bold text-ink lg:pl-[52px]">
                {title}
              </h3>
              <p className="mt-1.5 border-b border-line pb-3 text-[0.75rem] leading-[1.45] text-ink/80 lg:pl-[52px] lg:pr-2">
                {body[0]} {body[1]}
              </p>
              {i < steps.length - 1 && (
                <ChevronRight
                  aria-hidden="true"
                  className="absolute top-[6px] right-[30px] hidden h-5 w-5 text-ink lg:block"
                  strokeWidth={2}
                />
              )}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
