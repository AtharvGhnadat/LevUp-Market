import {
  ArrowLeft,
  Box,
  Headphones,
  Layers,
  LockKeyhole,
  MailCheck,
  Settings2,
} from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { to } from "@/lib/routes";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
} & (
  | { mode: "login" | "signup"; guide?: never }
  | { mode?: undefined; guide: { title: string; description: string } }
);

const guides = {
  login: {
    label: "Account access",
    title: (
      <>
        Welcome back to
        <br />
        LevUp Projects
      </>
    ),
    intro: "Pick up your projects, track an order, or get help with a custom request.",
    benefits: [
      {
        icon: Layers,
        title: "Your projects",
        detail: "Open your purchased projects and available deliverables.",
      },
      {
        icon: Box,
        title: "Orders & requests",
        detail: "Check an order or follow a custom development request.",
      },
      {
        icon: Headphones,
        title: "Dedicated support",
        detail: "Read replies and continue a conversation with the team.",
      },
    ],
  },
  signup: {
    label: "Get started",
    title: (
      <>
        Create your
        <br />
        LevUp Projects
        <br />
        account
      </>
    ),
    intro: "Keep your engineering projects, orders and custom requests together in one workspace.",
    benefits: [
      {
        icon: Layers,
        title: "Build your project library",
        detail: "Find your purchased projects and their resources in one place.",
      },
      {
        icon: Box,
        title: "Manage custom requests",
        detail: "Submit your project brief and follow its progress.",
      },
      {
        icon: Settings2,
        title: "Make it your workspace",
        detail: "Add your institution, course and project interests when you’re ready.",
      },
    ],
  },
};

export function AuthLayout({ title, description, guide, children, mode }: Props) {
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
  const feature = mode && guides[mode];
  return (
    <section
      aria-labelledby="auth-title"
      className={feature ? "auth-canvas" : "auth-spread auth-service"}
    >
      {feature && (
        <div aria-hidden="true" className="auth-watermark">
          <LogoMark />
        </div>
      )}
      <div className={feature ? "auth-columns" : "contents"}>
        <div className={feature ? "auth-card customer-enter" : "auth-form-panel customer-enter"}>
          {!feature && (
            <a href={to("/projects")} className="workspace-back">
              <ArrowLeft size={15} aria-hidden="true" />
              Project catalog
            </a>
          )}
          <h1
            ref={heading}
            id="auth-title"
            tabIndex={-1}
            className={feature ? "auth-card-title" : "auth-heading"}
          >
            {title}
          </h1>
          <p
            className={
              feature ? "auth-card-intro" : "mb-6 mt-3 max-w-[45ch] leading-relaxed text-muted"
            }
          >
            {description}
          </p>
          {children}
          {feature && (
            <div className="auth-footnotes">
              <span>
                <LockKeyhole aria-hidden="true" />
                Password sign-in
              </span>
              <span>
                <MailCheck aria-hidden="true" />
                Email verification
              </span>
            </div>
          )}
        </div>
        {feature ? (
          <aside className="auth-story customer-enter" aria-labelledby="auth-welcome">
            <p className="auth-kicker">{feature.label}</p>
            <h2 id="auth-welcome">{feature.title}</h2>
            <p className="auth-story-intro">{feature.intro}</p>
            <ul className="auth-benefits">
              {feature.benefits.map(({ icon: Icon, title: benefit, detail }) => (
                <li key={benefit}>
                  <span className="auth-benefit-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{benefit}</h3>
                    <p>{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        ) : (
          guide && (
            <aside className="auth-guidance">
              <h2 className="font-display text-lg font-semibold">{guide.title}</h2>
              <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-muted">
                {guide.description}
              </p>
            </aside>
          )
        )}
      </div>
    </section>
  );
}
