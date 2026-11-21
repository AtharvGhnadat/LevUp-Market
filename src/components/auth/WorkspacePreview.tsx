import { FileCode2, FileSpreadsheet, FileText, FolderArchive, UserRound } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";

const sampleFiles = [
  { icon: FileCode2, name: "Assembly drawing", ext: "DWG" },
  { icon: FileSpreadsheet, name: "Bill of materials", ext: "XLSX" },
  { icon: FileText, name: "Design notes", ext: "PDF" },
  { icon: FolderArchive, name: "Source files", ext: "ZIP" },
];

export function WorkspacePreview() {
  return (
    <figure className="bench-preview" aria-label="Illustrative engineering workspace">
      <figcaption>
        <strong>
          <LogoMark />
          LevUp Projects
        </strong>
        <span>Workspace preview</span>
        <UserRound aria-hidden="true" size={16} />
      </figcaption>
      <div className="bench-panels">
        <section>
          <h3>File library</h3>
          {sampleFiles.map(({ icon: Glyph, name, ext }) => {
            return (
              <div className="bench-file" key={name}>
                <Glyph size={19} aria-hidden="true" />
                <span>
                  {name}
                  <small>{ext}</small>
                </span>
              </div>
            );
          })}
        </section>
        <section>
          <small>Example custom build</small>
          <h3>Material handling fixture</h3>
          <ol className="bench-track">
            {["Brief", "Design", "Review", "Delivery"].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
          <svg
            className="bench-drawing"
            viewBox="0 0 320 140"
            role="img"
            aria-label="Front and side elevations of a mounting fixture"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M22 106h179v10H22zm5-9h169v9H27zm20 0V44h16v53m92 0V44h16v53M63 71h92v7H63zM244 99h55v11h-55zm4 0V76l26-31q7-7 14-1l7 8v47z" />
              <circle cx="55" cy="54" r="4" />
              <circle cx="163" cy="54" r="4" />
              <circle cx="281" cy="55" r="8" />
              <circle cx="281" cy="55" r="12" />
            </g>
            <g fill="none" stroke="#81928c" strokeWidth=".85">
              <path d="M47 40V20m124 20V20M44 25h130m-130 3 6-6m118 6 6-6M15 44v71m-4-68 7-6m-7 77 7-6M11 116h194m35-6h63" />
              <path strokeDasharray="5 3" d="M55 40v81m108-81v81m118-90v83m-44-60h70" />
            </g>
            <g fill="currentColor" fontSize="8" fontFamily="monospace">
              <text x="88" y="21">
                320.0
              </text>
              <text x="82" y="132">
                FRONT
              </text>
              <text x="261" y="132">
                SIDE
              </text>
            </g>
          </svg>
        </section>
      </div>
    </figure>
  );
}
