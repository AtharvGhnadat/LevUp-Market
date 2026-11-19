import { ArrowRight } from "lucide-react";
import { to } from "@/lib/routes";
import { RouteRow, TextLink } from "@/components/workspace/WorkspaceUI";
import { resourceLinks as resources } from "@/data/navigation";
const questions = [
  [
    "Where is my cart saved?",
    "The cart stays in the browser where you selected your project, package and add-ons. Sign in there to keep those selections.",
  ],
  [
    "Do I need to be a student?",
    "Students, professionals and other customers can use LevUp. Academic details are optional and can be added after signup.",
  ],
  [
    "When do I need a delivery address?",
    "Keep a delivery address for physical hardware. Browsing and digital-only projects do not require an address.",
  ],
  [
    "Where do I track a custom brief?",
    "After reviewing the specification, signed-in customers can submit it to Custom requests. A local export stays on your device.",
  ],
  [
    "How do I get help with an order?",
    "Open Support in your workspace with the order reference. You can read responses in Messages.",
  ],
];
export function ResourcePage({ path }: { path: string }) {
  const guide = path === resources[0].href,
    faq = path === "/faq",
    about = path === "/about";
  const title = guide
    ? "Project guide"
    : faq
      ? "Customer FAQs"
      : about
        ? "About LevUp Projects"
        : "Resources";
  return (
    <article className="resource-page customer-enter">
      <a className="workspace-back" href={to(guide || faq ? "/resources" : "/")}>
        {guide || faq ? "Resources" : "Storefront"}
      </a>
      <h1 className="workspace-title">{title}</h1>
      {about ? (
        <>
          <p className="resource-lead">Engineering projects for people who learn by building.</p>
          <div className="resource-about">
            <img
              src={to("/workbench/electronics.webp")}
              alt="Microcontrollers, servos and breadboards arranged on a workbench"
              width={950}
              height={633}
            />
            <div>
              <h2 className="workspace-section-title">What you can build</h2>
              <p>
                LevUp brings software, AI, embedded systems and electronics projects into one
                catalog. Project pages explain the technologies, packages and deliverables so you
                can compare the work involved.
              </p>
              <TextLink href="/projects">Explore projects</TextLink>
              <h2 className="workspace-section-title mt-5">When you need a different scope</h2>
              <p>
                Prepare a custom engineering brief with requirements, a target date and the
                deliverables you need.
              </p>
              <TextLink href="/custom-project">Prepare a brief</TextLink>
            </div>
          </div>
        </>
      ) : guide ? (
        <>
          <p className="resource-lead">From a project idea to a specification you can review.</p>
          {[
            [
              "Choose the engineering domain",
              "Filter the catalog by category and check the project’s technologies, difficulty and delivery type.",
              "/projects",
              "Browse the catalog",
            ],
            [
              "Compare the package",
              "Open the project detail and compare deliverables across the available packages. Select hardware and other add-ons before adding it to your cart.",
              "/cart",
              "Review your cart",
            ],
            [
              "Describe a custom build",
              "Write down the problem, expected behavior, hardware constraints, budget and target date. Review the specification before submitting it from your account.",
              "/custom-project",
              "Create a custom brief",
            ],
          ].map(([h, p, link, label]) => (
            <section key={h} className="resource-section">
              <h2>{h}</h2>
              <p>{p}</p>
              <TextLink href={link}>{label}</TextLink>
            </section>
          ))}
        </>
      ) : faq ? (
        <>
          <p className="resource-lead">
            Quick answers about using the marketplace and your workspace.
          </p>
          {questions.map(([q, answer]) => (
            <details key={q} className="border-b border-line py-2">
              <summary className="min-h-12 cursor-pointer content-center font-semibold">
                {q}
              </summary>
              <p className="max-w-prose pb-3 leading-relaxed text-muted">{answer}</p>
            </details>
          ))}
          <a className="workspace-link" href={to("/dashboard/support")}>
            Contact account support <ArrowRight size={15} aria-hidden="true" />
          </a>
        </>
      ) : (
        <>
          <p className="resource-lead">
            Practical help for choosing, specifying and managing an engineering project.
          </p>
          {resources.map((item) => (
            <RouteRow
              key={item.href}
              href={item.href}
              title={item.label}
              detail={item.description}
            />
          ))}
        </>
      )}
    </article>
  );
}
