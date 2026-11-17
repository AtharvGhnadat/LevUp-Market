import type { LucideIcon } from "lucide-react";
import { CreditCard, Layers, Settings, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

const benefits: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: Settings,
    title: "Academic & Real-World Projects",
    body: "Mini, major and industry-relevant solutions",
  },
  { icon: Layers, title: "Flexible Development", body: "Buy ready-made or build custom" },
  {
    icon: CreditCard,
    title: "Multiple Payment Options",
    body: "Full, milestone or advance + balance",
  },
  {
    icon: ShieldCheck,
    title: "Defined Revisions & Support",
    body: "Package-based revisions and issue support",
  },
];

export function BenefitStrip() {
  return (
    <section aria-label="Why buy with LevUp Projects" className="relative z-10 bg-ink text-white">
      <Container>
        <ul className="grid gap-y-6 py-7 sm:grid-cols-2 lg:h-[93px] lg:grid-cols-4 lg:items-center lg:py-0">
          {benefits.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className={cn(
                "flex items-center gap-4 lg:justify-center",
                i === 0 && "lg:justify-start",
                i === benefits.length - 1 && "lg:justify-end",
                i > 0 && "lg:border-l lg:border-white/15",
              )}
            >
              <Icon aria-hidden="true" className="h-9 w-9 shrink-0 text-copper" strokeWidth={1.5} />
              <span>
                <span className="block font-display text-[0.875rem] font-bold">{title}</span>
                <span className="mt-0.5 block text-[0.6875rem] text-white/75">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
