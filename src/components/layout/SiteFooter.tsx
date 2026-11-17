import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { footerGroups } from "@/data/navigation";
import { to } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-alloy-line bg-alloy text-white">
      <Container className="relative z-10 pt-12 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo tone="dark" />
            <p className="mt-4 max-w-[280px] text-xs leading-relaxed text-muted-on-alloy">
              Precision engineering marketplace providing ready-to-deploy hardware, software, IoT,
              and verified milestone development.
            </p>
          </div>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-labelledby={`footer-${group.title}`}>
              <h2
                id={`footer-${group.title}`}
                className="font-sans text-xs font-semibold tracking-wider text-white/60 uppercase"
              >
                {group.title}
              </h2>
              <ul className="mt-3.5 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={to(link.href)}
                      className="text-xs text-white/80 transition-colors hover:text-volt focus-visible:underline focus-visible:outline-none"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} LevUp Projects. All rights reserved.
          </p>
          <p className="font-mono text-[0.6875rem] text-white/40">
            Engineered for Precision &amp; Verification
          </p>
        </div>
      </Container>
    </footer>
  );
}
