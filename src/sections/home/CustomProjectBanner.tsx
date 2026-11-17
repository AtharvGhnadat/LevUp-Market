import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { unsplash, unsplashSrcSet } from "@/lib/image";
import { to } from "@/lib/routes";

const BANNER_IMAGE = "photo-1775519686045-cfd36ca0accc";

export function CustomProjectBanner() {
  return (
    <section id="custom" aria-labelledby="custom-title" className="scroll-mt-24">
      <Container size="wide">
        <div className="relative overflow-hidden rounded-lg bg-ink text-white lg:h-[246px]">
          <img
            src={unsplash(BANNER_IMAGE, 1100)}
            srcSet={unsplashSrcSet(BANNER_IMAGE, [700, 1100, 1600])}
            sizes="(min-width:1024px) 60vw, 100vw"
            alt="Engineer wiring an electronics prototype at a workbench beside a laptop"
            loading="lazy"
            decoding="async"
            style={{ objectPosition: "50% 70%" }}
            className="aspect-[16/9] w-full object-cover sm:aspect-[16/7] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:h-full lg:w-[62%]"
          />
          <div className="relative px-6 py-8 sm:px-10 lg:absolute lg:inset-0 lg:bg-ink lg:py-0 lg:pl-[90px] lg:[clip-path:polygon(0_0,55.5%_0,45.5%_100%,0_100%)]">
            <div className="flex h-full max-w-[400px] flex-col justify-center">
              <Eyebrow tone="dark" className="text-[0.625rem]">
                Custom Development
              </Eyebrow>
              <h2 id="custom-title" className="mt-2 text-section font-extrabold">
                Need a Completely <br className="hidden sm:block" />
                Custom Project?
              </h2>
              <p className="mt-3 max-w-[360px] text-[0.875rem] leading-[1.5] text-white/90">
                Share your idea, requirements and timeline. Our team will analyze it and provide a
                detailed quotation with the best approach and deliverables.
              </p>
              <ButtonLink
                href={to("/custom-project")}
                size="md"
                className="mt-4 h-[42px] w-fit px-[22px]"
              >
                Request Custom Project
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
