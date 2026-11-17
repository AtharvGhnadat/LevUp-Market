import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  Code2,
  Cpu,
  Layers,
  Settings,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { to } from "@/lib/routes";

const homeCategories = [
  {
    name: "IoT Systems",
    icon: Cpu,
    href: "/projects?category=iot-electronics",
  },
  {
    name: "Software Projects",
    icon: Code2,
    href: "/projects?category=software-development",
  },
  {
    name: "Embedded Systems",
    icon: Settings,
    href: "/projects?category=embedded-systems",
  },
  {
    name: "Robotics",
    icon: Bot,
    href: "/projects?category=robotics",
  },
  {
    name: "AI / ML Projects",
    icon: BrainCircuit,
    href: "/projects?category=artificial-intelligence-ml",
  },
  {
    name: "Electronics Projects",
    icon: Activity,
    href: "/projects?category=iot-electronics",
  },
  {
    name: "Hybrid Solutions",
    icon: Layers,
    href: "/projects?delivery=hybrid",
  },
];

export function CategoryGrid() {
  return (
    <section
      id="categories"
      aria-labelledby="categories-title"
      className="scroll-mt-24 py-8 sm:py-10"
    >
      <Container>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="h-0.5 w-6 bg-volt-action" aria-hidden="true" />
            <h2
              id="categories-title"
              className="font-display text-xl font-extrabold text-alloy sm:text-2xl"
            >
              Explore Project Categories
            </h2>
          </div>
          <a
            href={to("/projects")}
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-volt-action hover:underline sm:text-sm"
          >
            <span>View All Categories</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
          </a>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-7">
          {homeCategories.map((c) => (
            <li key={c.name}>
              <a
                href={to(c.href)}
                className="group flex flex-col items-center justify-center rounded-lg border border-line bg-white p-4 text-center shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-volt hover:shadow-card-hover sm:p-5"
              >
                <c.icon
                  aria-hidden="true"
                  className="h-7 w-7 text-alloy transition-colors duration-200 group-hover:text-volt-action sm:h-8 sm:w-8"
                  strokeWidth={1.75}
                />
                <span className="mt-3 font-display text-xs font-bold leading-tight text-alloy sm:text-sm">
                  {c.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
