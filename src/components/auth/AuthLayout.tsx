import { useEffect, useRef, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type Props = {
  title: string;
  description: string;
  guide: { title: string; description: string };
  children: ReactNode;
};

export function AuthLayout({ title, description, guide, children }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  const previousTitle = useRef(title);

  useEffect(() => {
    const saved = document.title;
    document.title = `${title} · LevUp Projects`;
    if (previousTitle.current !== title) heading.current?.focus();
    previousTitle.current = title;
    return () => {
      document.title = saved;
    };
  }, [title]);

  return (
    <section aria-labelledby="auth-title" className="border-b border-line bg-mineral">
      <Container className="py-9 sm:py-12 lg:py-16">
        <div className="mx-auto grid max-w-[1000px] items-start gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
          <div className="min-w-0">
            <h1
              ref={heading}
              id="auth-title"
              tabIndex={-1}
              className="font-display text-3xl leading-tight font-semibold tracking-tight text-alloy sm:text-4xl"
            >
              {title}
            </h1>
            <p className="mt-2 max-w-[56ch] text-base leading-relaxed text-muted">{description}</p>
            <div className="mt-6 sm:mt-8">{children}</div>
          </div>
          <aside className="rounded-lg border border-alloy-line bg-alloy px-5 py-5 text-mineral sm:px-6 sm:py-6 lg:mt-1 lg:px-8 lg:py-8">
            <h2 className="font-display text-lg font-semibold">{guide.title}</h2>
            <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-mineral/90">
              {guide.description}
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
