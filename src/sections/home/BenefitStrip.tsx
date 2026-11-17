import { Award, GraduationCap, Users, Zap } from "lucide-react";
import { Container } from "@/components/ui/Container";

const stats = [
  {
    icon: Users,
    title: "500+",
    body: "Projects & Solutions",
  },
  {
    icon: GraduationCap,
    title: "Engineering Focus",
    body: "ECE, CSE, EEE, ME & more",
  },
  {
    icon: Zap,
    title: "End-to-End Support",
    body: "Build · Modify · Deliver",
  },
  {
    icon: Award,
    title: "Student Friendly",
    body: "Academic & Competition Ready",
  },
];

export function BenefitStrip() {
  return (
    <section
      aria-label="Key marketplace assurances and scale"
      className="border-y border-line bg-white/70 py-6 sm:py-7"
    >
      <Container>
        <ul className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4 lg:items-center">
          {stats.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-center gap-3.5 sm:gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-volt/10 text-volt-action">
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <span className="block font-display text-sm font-bold text-alloy leading-tight sm:text-base">
                  {title}
                </span>
                <span className="mt-0.5 block font-sans text-xs font-medium text-muted">
                  {body}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
