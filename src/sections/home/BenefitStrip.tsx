import { Code2, GraduationCap, Package, Zap } from "lucide-react";
import { Container } from "@/components/ui/Container";

const stats = [
  {
    icon: Code2,
    title: "Source Code & Documentation",
    body: "Complete source files included with applicable packages",
  },
  {
    icon: Package,
    title: "Digital & Hardware Delivery",
    body: "Instant digital or physical shipment by project type",
  },
  {
    icon: Zap,
    title: "Technical Support & Revisions",
    body: "Post-delivery assistance as defined in your package",
  },
  {
    icon: GraduationCap,
    title: "Student Friendly",
    body: "Academic & Competition Ready",
  },
];

export function BenefitStrip() {
  return (
    <section
      aria-label="Key marketplace assurances"
      className="border-y border-line bg-white/80 py-6"
    >
      <Container>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:items-center">
          {stats.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-start gap-3 sm:items-center sm:gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-volt-tint text-volt-text">
                <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <div>
                <span className="block font-display text-sm font-semibold leading-tight text-alloy">
                  {title}
                </span>
                <span className="mt-1 block font-sans text-xs leading-snug text-muted">{body}</span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
