import { ArrowRight, Code2, Headphones, Layers, Settings, Truck } from "lucide-react";
import { useId } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { unsplash } from "@/lib/image";
import { to } from "@/lib/routes";

const HERO_IMAGE = "photo-1779309487417-6b44e5f4b036";

const serviceLabels = [
  { icon: Code2, label: "Complete Source Files" },
  { icon: Layers, label: "Project Documentation" },
  { icon: Headphones, label: "Development Support" },
  { icon: Truck, label: "Digital & Hardware Delivery" },
];

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden lg:min-h-[420px]">
      <Container className="relative z-10 pt-[26px] pb-10 lg:pb-[30px]">
        <div className="max-w-[560px]">
          <p className="font-display text-[0.6875rem] font-bold tracking-[0.04em] text-ink uppercase sm:text-[0.8125rem]">
            Software <Dot /> Electronics <Dot /> IoT <Dot /> Robotics <Dot /> Embedded
          </p>

          <h1 id="hero-title" className="mt-2.5 text-hero font-extrabold text-ink">
            <span className="block">Engineering Projects</span>
            <span className="block">From Idea to Working</span>
            <span className="relative inline-block text-copper">
              Implementation
              <svg
                aria-hidden="true"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="absolute -bottom-[7px] left-0 h-[9px] w-[104%]"
              >
                <path
                  d="M2 9C70 4 170 2 298 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-[22px] max-w-[450px] text-[1rem] leading-[1.55] text-ink">
            Get ready-to-use projects or request a fully custom solution with source files,
            documentation, and post-delivery support.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-5">
            <ButtonLink href={to("/projects")} className="w-full sm:w-[194px]">
              Explore Projects
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
            </ButtonLink>
            <ButtonLink
              href={to("/custom-project")}
              variant="outline"
              className="w-full bg-white/40 sm:w-[257px]"
            >
              <Settings aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2} />
              Request Custom Project
            </ButtonLink>
          </div>
        </div>

        <ul className="mt-[30px] grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-wrap sm:items-center text-[0.6875rem] font-semibold text-ink">
          {serviceLabels.map(({ icon: Icon, label }, i) => (
            <li
              key={label}
              className={
                i === 0
                  ? "flex items-center gap-2 sm:pr-5"
                  : "flex items-center gap-2 sm:border-l sm:border-line sm:px-5 sm:last:pr-0"
              }
            >
              <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />
              {label}
            </li>
          ))}
        </ul>
      </Container>

      {/* Desktop: framed photograph occupies the right of the hero. Below lg it stacks under the copy. */}
      <div className="relative mx-auto aspect-[800/420] w-full max-w-[800px] lg:absolute lg:inset-y-0 lg:right-0 lg:mx-0 lg:aspect-auto lg:w-[55.6%] lg:max-w-none">
        <HeroFrame />
      </div>
    </section>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="mx-1.5">
      ·
    </span>
  );
}

/** Geometric frame: copper slash, angled photograph, copper and slate wedges. */
function HeroFrame() {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 800 420"
      preserveAspectRatio="xMinYMid slice"
      role="img"
      aria-label="Wheeled robot with a robotic arm, microcontroller and wiring"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <clipPath id={`${uid}-photo`}>
          <path d="M196 0H800V240L703 352Q689 368 667 367L74 341Q50 340 58 320Z" />
        </clipPath>
        <linearGradient id={`${uid}-slash`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C2632A" />
          <stop offset="1" stopColor="#E59A62" />
        </linearGradient>
        <linearGradient id={`${uid}-shade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#172D38" stopOpacity=".35" />
          <stop offset=".5" stopColor="#172D38" stopOpacity=".05" />
          <stop offset="1" stopColor="#172D38" stopOpacity=".25" />
        </linearGradient>
      </defs>

      <path d="M128 0H196L58 326Q52 340 37 340H12Q-2 340 4 327Z" fill={`url(#${uid}-slash)`} />
      <path d="M800 232V306L738 382H684Z" fill="#D97736" />

      <g clipPath={`url(#${uid}-photo)`}>
        <rect x="40" y="0" width="760" height="420" fill="#172D38" />
        <image
          href={unsplash(HERO_IMAGE, 1400)}
          x="50"
          y="0"
          width="750"
          height="372"
          preserveAspectRatio="xMidYMid slice"
        />
        <rect x="40" y="0" width="760" height="420" fill={`url(#${uid}-shade)`} />
      </g>

      <path d="M800 276V420H632Q652 420 664 406Z" fill="#172D38" />
    </svg>
  );
}
