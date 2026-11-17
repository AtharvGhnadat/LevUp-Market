import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { categories } from "@/data/categories";
import { unsplash, unsplashSrcSet } from "@/lib/image";
import { to } from "@/lib/routes";

export function CategoryGrid() {
  return (
    <section id="categories" aria-labelledby="categories-title" className="scroll-mt-24 pt-7">
      <Container>
        <Eyebrow align="center">Explore Categories</Eyebrow>
        <h2 id="categories-title" className="mt-2 text-center text-section font-extrabold text-ink">
          Find Projects by <span className="text-copper">Your Domain</span>
        </h2>
        <p className="mt-3 text-center text-[0.875rem] text-ink/80">
          Discover projects across core engineering and technology areas.
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-6 xl:gap-[22px]">
          {categories.map((c) => (
            <li key={c.slug}>
              <a
                href={to(`/projects?category=${c.slug}`)}
                className="group block overflow-hidden rounded-md border border-line bg-white shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="aspect-[201/101] overflow-hidden bg-paper-deep">
                  <img
                    src={unsplash(c.imageId, 420)}
                    srcSet={unsplashSrcSet(c.imageId, [320, 420, 640])}
                    sizes="(min-width:1280px) 201px, (min-width:768px) 33vw, 50vw"
                    alt={c.imageAlt}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: c.focus }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex h-[76px] items-center justify-between gap-2 px-4 xl:pl-[22px]">
                  <h3 className="font-display text-[0.9375rem] leading-[1.25] font-bold min-[1400px]:text-[1rem] text-ink">
                    {c.lines[0]}
                    {c.lines[1] && (
                      <>
                        <br />
                        {c.lines[1]}
                      </>
                    )}
                  </h3>
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-3 h-4 w-4 shrink-0 text-ink transition-transform group-hover:translate-x-0.5 group-hover:text-copper-ink"
                    strokeWidth={2.25}
                  />
                </div>
              </a>
            </li>
          ))}
        </ul>

        <hr className="mt-8 border-line" />
      </Container>
    </section>
  );
}
