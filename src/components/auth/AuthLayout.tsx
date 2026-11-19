import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { to } from "@/lib/routes";

type Props = {
  title: string;
  description: string;
  guide: { title: string; description: string };
  children: ReactNode;
  mode?: "login" | "signup";
};

const features = {
  login: {
    image: "robotics",
    category: "Robotics",
    slug: "robotics",
    alt: "An articulated orange robot arm and gripper on a workshop surface",
  },
  signup: {
    image: "electronics",
    category: "IoT & electronics",
    slug: "iot-electronics",
    alt: "A collection of microcontrollers and electronic components on a workbench",
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
  const feature = mode && features[mode];
  return (
    <section
      aria-labelledby="auth-title"
      className={feature ? "auth-spread" : "auth-spread auth-service"}
    >
      <div className="auth-form-panel customer-enter">
        <a href={to("/projects")} className="workspace-back">
          <ArrowLeft size={15} aria-hidden="true" />
          Project catalog
        </a>
        <h1 ref={heading} id="auth-title" tabIndex={-1} className="auth-heading">
          {title}
        </h1>
        <p className="mb-6 mt-3 max-w-[45ch] leading-relaxed text-muted">{description}</p>
        {children}
      </div>
      {feature ? (
        <aside className="auth-plate">
          <img
            src={to(`/workbench/${feature.image}.webp`)}
            alt={feature.alt}
            width={950}
            height={610}
            className="auth-photo"
          />
          <a className="auth-caption" href={to(`/projects?category=${feature.slug}`)}>
            <span>
              <span className="block text-sm text-muted-on-alloy">From the project catalog</span>
              <span className="mt-1 block font-display text-2xl font-semibold">
                {feature.category}
              </span>
            </span>
            <ArrowUpRight size={22} aria-hidden="true" />
          </a>
        </aside>
      ) : (
        <aside className="auth-guidance">
          <h2 className="font-display text-lg font-semibold">{guide.title}</h2>
          <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-muted">
            {guide.description}
          </p>
        </aside>
      )}
    </section>
  );
}
