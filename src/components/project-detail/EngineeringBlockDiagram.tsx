import { ArrowRight } from "lucide-react";
import type { ProjectDetail } from "@/data/project-details";

export function EngineeringBlockDiagram({ diagram }: { diagram: ProjectDetail["diagram"] }) {
  const groups = [[...diagram.inputs], [diagram.controller], [diagram.process], diagram.outputs];
  return (
    <div className="max-w-full overflow-x-auto pb-2">
      <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-2">
        {groups.map((nodes, index) => (
          <div key={index} className="contents">
            <div className="space-y-2">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={
                    node.id === diagram.controller.id
                      ? "rounded-lg border border-volt-action/50 bg-volt-tint px-2.5 py-4 text-center shadow-xs"
                      : "rounded-lg border border-line bg-white px-2.5 py-3 text-center"
                  }
                >
                  <p className="font-display text-xs font-semibold leading-snug text-ink">
                    {node.label}
                  </p>
                  {node.optional && (
                    <p className="mt-0.5 text-[0.625rem] font-medium text-volt-text">Optional</p>
                  )}
                </div>
              ))}
            </div>
            {index < groups.length - 1 && (
              <ArrowRight
                aria-hidden="true"
                className="mx-auto h-4 w-4 shrink-0 rotate-90 text-muted sm:rotate-0"
                strokeWidth={1.75}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
