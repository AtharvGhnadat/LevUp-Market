import { ArrowRight, Code2, Cpu, FileText, Layers, Settings, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { unsplash } from "@/lib/image";
import { to } from "@/lib/routes";

const HERO_IMAGE = "photo-1779309487417-6b44e5f4b036";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-mineral pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-12"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Heading, Copy, Perks & CTAs */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-volt-action" aria-hidden="true" />
              <span className="font-mono text-xs font-bold tracking-wider text-alloy uppercase">
                Engineering Projects Marketplace
              </span>
            </div>

            <h1
              id="hero-title"
              className="mt-3.5 font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-alloy sm:text-5xl lg:text-[3.35rem]"
            >
              Academic Projects <br />
              Built, Delivered <br />
              and <span className="text-volt">Supported.</span>
            </h1>

            <p className="mt-4 max-w-[480px] font-sans text-sm leading-relaxed text-muted sm:text-base">
              Find ready-to-use projects or get a custom solution for your academic, research or
              competition needs — with documentation, source code and expert support.
            </p>

            {/* 3 Value bullets */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-semibold text-alloy sm:text-sm">
              <div className="flex items-center gap-2">
                <Code2 aria-hidden="true" className="h-4 w-4 shrink-0 text-alloy" strokeWidth={2} />
                <span>Source Code &amp; Documentation</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-alloy"
                  strokeWidth={2}
                />
                <span>Working Implementation</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-alloy"
                  strokeWidth={2}
                />
                <span>Revisions &amp; Support</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-center">
              <ButtonLink
                href={to("/projects")}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-6 font-semibold"
              >
                Explore Projects
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
              </ButtonLink>
              <ButtonLink
                href={to("/custom-project")}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-alloy/30 bg-white/70 px-5 font-semibold text-alloy hover:bg-white"
              >
                <FileText aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                Request Custom Project
              </ButtonLink>
            </div>
          </div>

          {/* Right Column: Workshop/Project Photography Showcase with floating pill badges */}
          <div className="relative lg:col-span-6 xl:col-span-6">
            <div className="relative mx-auto aspect-[16/11] w-full max-w-[620px] overflow-hidden rounded-2xl border border-line bg-mineral shadow-card lg:aspect-[16/11]">
              <img
                src={unsplash(HERO_IMAGE, 1200)}
                alt="Assembled robotic project with microcontroller and yellow drive wheels on an engineering workbench"
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />

              {/* Floating Pill Badges */}
              <div className="pointer-events-none absolute inset-0 p-4 sm:p-6">
                {/* Hardware Projects */}
                <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full border border-line bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-xs sm:top-6 sm:right-6 sm:px-3.5 sm:py-2">
                  <Cpu aria-hidden="true" className="h-4 w-4 text-alloy" strokeWidth={2} />
                  <span className="font-sans text-xs font-semibold text-alloy">
                    Hardware Projects
                  </span>
                </div>

                {/* Software Projects */}
                <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2 rounded-full border border-line bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-xs sm:right-5 sm:px-3.5 sm:py-2">
                  <Code2 aria-hidden="true" className="h-4 w-4 text-alloy" strokeWidth={2} />
                  <span className="font-sans text-xs font-semibold text-alloy">
                    Software Projects
                  </span>
                </div>

                {/* Hybrid Solutions */}
                <div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full border border-line bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-xs sm:right-6 sm:bottom-6 sm:px-3.5 sm:py-2">
                  <Layers aria-hidden="true" className="h-4 w-4 text-alloy" strokeWidth={2} />
                  <span className="font-sans text-xs font-semibold text-alloy">
                    Hybrid Solutions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
