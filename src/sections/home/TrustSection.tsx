import type { LucideIcon } from "lucide-react";
import { Code2, Headphones, Layers, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const items: Array<{
  icon: LucideIcon;
  title: string;
  body: [string, string];
  tone: "ink" | "copper";
}> = [
  {
    icon: Code2,
    title: "Complete Deliverables",
    body: ["Source code, documentation,", "reports, PPTs and more."],
    tone: "ink",
  },
  {
    icon: Layers,
    title: "Clear Revision Policy",
    body: ["Defined free revisions", "as per your package."],
    tone: "copper",
  },
  {
    icon: Truck,
    title: "Multiple Delivery Modes",
    body: ["Instant digital delivery or", "physical hardware shipping."],
    tone: "copper",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    body: ["Project assistance and", "issue resolution after delivery."],
    tone: "copper",
  },
];

export function TrustSection() {
  return (
    <section aria-labelledby="trust-title" className="pb-5">
      <Container size="wide">
        <div className="grid gap-8 rounded-lg bg-paper-deep px-6 py-7 sm:px-10 lg:min-h-[134px] lg:grid-cols-[247px_1fr] lg:items-center lg:gap-0 lg:py-4 lg:pl-[46px]">
          <div className="lg:border-r-[2.5px] lg:border-copper lg:pr-6">
            <Eyebrow className="text-[0.625rem]">Why LevUp Projects</Eyebrow>
            <h2
              id="trust-title"
              className="mt-1.5 font-display text-[1.5625rem] leading-[1.12] font-extrabold tracking-[-0.02em] text-ink"
            >
              Built for <br className="hidden lg:block" />
              Reliability &amp; <br className="hidden lg:block" />
              Transparency
            </h2>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.08fr_1fr_1.05fr_1fr] lg:gap-4 lg:pl-[65px]">
            {items.map(({ icon: Icon, title, body, tone }) => (
              <li key={title}>
                <Icon
                  aria-hidden="true"
                  className={
                    tone === "ink" ? "h-[26px] w-[26px] text-ink" : "h-[26px] w-[26px] text-copper"
                  }
                  strokeWidth={1.6}
                />
                <h3 className="mt-2 font-display text-[0.875rem] font-bold text-ink">{title}</h3>
                <p className="mt-1 text-[0.8125rem] leading-[1.45] text-success">
                  {body[0]}
                  <br className="hidden lg:block" /> {body[1]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
