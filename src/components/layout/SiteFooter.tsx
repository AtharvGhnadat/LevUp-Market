import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { footerGroups } from "@/data/navigation";
import { to } from "@/lib/routes";

/*
 * Social icons from the reference are intentionally omitted until LevUp Projects
 * has official channels — linking to placeholder profiles would be misleading.
 */
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <Container className="relative z-10 pt-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[3.16fr_1.64fr_1.4fr_1.66fr_1fr] lg:gap-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo tone="dark" />
            <p className="mt-4 max-w-[310px] text-[0.75rem] leading-[1.6] text-white/85">
              A dedicated platform to buy ready-made engineering projects or get custom projects
              developed with complete deliverables and support.
            </p>
          </div>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-labelledby={`footer-${group.title}`} className="lg:pt-1">
              <h2 id={`footer-${group.title}`} className="font-display text-[0.8125rem] font-bold">
                {group.title}
              </h2>
              <ul className="mt-2.5 space-y-[5px] leading-[15px]">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={to(link.href)}
                      className="text-[0.75rem] text-white/85 transition-colors hover:text-copper hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-5 border-t border-white/15 py-3.5 lg:mr-[10%]">
          <p className="text-[0.75rem] text-white/90">
            © {new Date().getFullYear()} LevUp Projects. All rights reserved.
          </p>
        </div>
      </Container>

      <svg
        aria-hidden="true"
        viewBox="0 0 330 80"
        preserveAspectRatio="none"
        className="pointer-events-none absolute right-0 bottom-0 h-[70px] w-[230px] sm:w-[330px] lg:h-[80px]"
      >
        <path d="M0 80Q20 48 70 46H250Q300 46 330 0V80Z" fill="#D97736" />
      </svg>
    </footer>
  );
}
