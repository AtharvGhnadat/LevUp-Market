import { ArrowRight } from "lucide-react";
import type { ProjectDetail } from "@/data/project-details";

export function EngineeringBlockDiagram({ diagram }: { diagram: ProjectDetail["diagram"] }) {
  const groups = [[...diagram.inputs], [diagram.controller], [diagram.process], diagram.outputs];
  return (
    <div className="max-w-full overflow-x-auto pb-2">
      <div className="grid min-w-[620px] grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-3">
        {groups.map((nodes, index) => (
          <div key={index} className="contents">
            <div className="space-y-2">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={
                    node.id === diagram.controller.id
                      ? "rounded-md border border-copper bg-copper-tint px-3 py-5 text-center shadow-card"
                      : "rounded-sm border border-ink/25 bg-white px-3 py-3 text-center"
                  }
                >
                  <p className="font-display text-[0.75rem] font-bold text-ink">{node.label}</p>
                  {node.optional && (
                    <p className="mt-0.5 text-[0.625rem] font-medium text-copper-ink">Optional</p>
                  )}
                </div>
              ))}
            </div>
            {index < groups.length - 1 && (
              <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-ink" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
