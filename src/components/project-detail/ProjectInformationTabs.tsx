import { Check, GraduationCap, House, Landmark, Sprout } from "lucide-react";
import { useId, useState } from "react";
import type { ProjectDetail } from "@/data/project-details";
import { cn } from "@/lib/cn";
import { EngineeringBlockDiagram } from "./EngineeringBlockDiagram";

type TabId = "overview" | "deliverables" | "tech-stack" | "documentation" | "faqs";
const tabs: Array<{ id: TabId; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "deliverables", label: "Deliverables" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "documentation", label: "Documentation" },
  { id: "faqs", label: "FAQs" },
];

export function ProjectInformationTabs({ project }: { project: ProjectDetail }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const uid = useId();

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === activeTab);
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[next].id);
    document.getElementById(`${uid}-${tabs[next].id}-tab`)?.focus();
  };

  return (
    <section aria-label="Project information">
      <div
        role="tablist"
        aria-label="Project information"
        onKeyDown={onKeyDown}
        className="flex max-w-full gap-1 overflow-x-auto border-b border-line"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`${uid}-${tab.id}-tab`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${uid}-${tab.id}-panel`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "min-h-11 min-w-[92px] shrink-0 rounded-t-sm px-2 text-[0.7rem] font-semibold transition-colors sm:min-w-0 sm:flex-1 sm:text-[0.875rem]",
              activeTab === tab.id ? "bg-ink text-white" : "bg-transparent text-ink hover:bg-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id={`${uid}-${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-${activeTab}-tab`}
        className="pt-5"
      >
        {activeTab === "overview" && <ProjectOverview project={project} />}
        {activeTab === "deliverables" && (
          <ListPanel
            title="Configured deliverables"
            description="Exact included items depend on the selected package. The configurator shows package-specific inclusion and prevents duplicate add-on charges."
            items={project.packages.flatMap((item) =>
              item.deliverables.map((deliverable) => `${item.name}: ${deliverable}`),
            )}
          />
        )}
        {activeTab === "tech-stack" && (
          <ListPanel
            title="Technology stack"
            description="Technologies used by the published project configuration."
            items={project.techStack}
          />
        )}
        {activeTab === "documentation" && (
          <ListPanel
            title="Documentation"
            description="Documentation availability follows the selected package."
            items={project.documentation}
          />
        )}
        {activeTab === "faqs" && (
          <div className="space-y-3">
            {project.faqs.length ? (
              project.faqs.map((faq) => (
                <details key={faq.question} className="rounded-sm border border-line bg-white p-4">
                  <summary className="cursor-pointer font-display text-sm font-bold text-ink">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{faq.answer}</p>
                </details>
              ))
            ) : (
              <p className="text-sm text-muted">
                No project-specific FAQs have been published yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectOverview({ project }: { project: ProjectDetail }) {
  const icons = [Sprout, House, GraduationCap, Landmark];
  return (
    <div className="grid max-w-full gap-7 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="min-w-0">
        <SectionHeading>Project Overview</SectionHeading>
        <div className="space-y-3 text-[0.8125rem] leading-[1.55] text-ink/85">
          {project.overview.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <SectionHeading className="mt-5">Key Features</SectionHeading>
        <ul className="space-y-1.5">
          {project.keyFeatures.map((feature) => (
            <li key={feature} className="flex gap-2 text-[0.8125rem] text-ink">
              <Check
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-copper text-white"
              />
              {feature}
            </li>
          ))}
        </ul>

        <SectionHeading className="mt-5">Learning Outcomes</SectionHeading>
        <ul className="grid gap-2 sm:grid-cols-2">
          {project.learningOutcomes.map((outcome) => (
            <li
              key={outcome}
              className="rounded-sm border border-line bg-white px-3 py-2 text-xs text-muted"
            >
              {outcome}
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0">
        <SectionHeading>System Block Diagram</SectionHeading>
        <EngineeringBlockDiagram diagram={project.diagram} />
        <SectionHeading className="mt-5">Application Areas</SectionHeading>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {project.applications.map((application, index) => {
            const Icon = icons[index % icons.length];
            return (
              <li
                key={application}
                className="rounded-sm border border-line bg-white px-2 py-3 text-center shadow-card"
              >
                <Icon aria-hidden="true" className="mx-auto h-5 w-5 text-ink" />
                <span className="mt-1.5 block text-[0.6875rem] font-semibold text-ink">
                  {application}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mb-3 border-l-[3px] border-copper pl-3 font-display text-[1rem] font-extrabold text-ink",
        className,
      )}
    >
      {children}
    </h2>
  );
}

function ListPanel({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div>
      <SectionHeading>{title}</SectionHeading>
      <p className="max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 rounded-sm border border-line bg-white px-3 py-2.5 text-sm text-ink"
          >
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
