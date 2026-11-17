import { catalogProjects, type CatalogProject, type CatalogDeliverable } from "./catalog-projects";

export type ProjectMedia = {
  id: string;
  imageId: string;
  alt: string;
  label: string;
  focus?: string;
};

export type ProjectPackage = {
  id: string;
  name: "Basic" | "Standard" | "Premium";
  price: number;
  shortDescription: string;
  deliverables: string[];
  includedAddOnIds: string[];
  freeRevisions: number;
  revisionWindowDays: number;
  supportDays: number;
};

export type ProjectAddOn = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  eligiblePackageIds: string[];
  makesPhysical: boolean;
};

export type DiagramNode = {
  id: string;
  label: string;
  detail?: string;
  optional?: boolean;
};

export type ProjectDetail = {
  catalog: CatalogProject;
  displayTitle: string;
  description: string;
  hardwarePlatform: string;
  sourceCodeIncluded: boolean;
  supportAvailable: boolean;
  tags: string[];
  media: ProjectMedia[];
  packages: ProjectPackage[];
  addOns: ProjectAddOn[];
  overview: string[];
  keyFeatures: string[];
  mainComponents: string[];
  learningOutcomes: string[];
  techStack: string[];
  documentation: string[];
  faqs: Array<{ question: string; answer: string }>;
  diagram: {
    inputs: DiagramNode[];
    controller: DiagramNode;
    process: DiagramNode;
    outputs: DiagramNode[];
  };
  applications: string[];
};

const irrigationPackages: ProjectPackage[] = [
  {
    id: "basic",
    name: "Basic",
    price: 499900,
    shortDescription: "Source code + circuit + setup documentation",
    deliverables: ["ESP32 source code", "Circuit diagram", "Setup documentation"],
    includedAddOnIds: ["editable-source"],
    freeRevisions: 1,
    revisionWindowDays: 14,
    supportDays: 14,
  },
  {
    id: "standard",
    name: "Standard",
    price: 649900,
    shortDescription: "Basic + technical report + presentation",
    deliverables: [
      "Everything in Basic",
      "Technical report",
      "Presentation",
      "Expanded test notes",
    ],
    includedAddOnIds: ["editable-source", "technical-report", "presentation"],
    freeRevisions: 2,
    revisionWindowDays: 30,
    supportDays: 30,
  },
  {
    id: "premium",
    name: "Premium",
    price: 849900,
    shortDescription: "Extended files + simulation + setup guidance",
    deliverables: [
      "Everything in Standard",
      "Proteus simulation files",
      "Installation and setup assistance",
      "Expanded setup guidance",
    ],
    includedAddOnIds: [
      "editable-source",
      "technical-report",
      "presentation",
      "simulation-files",
      "installation",
    ],
    freeRevisions: 3,
    revisionWindowDays: 45,
    supportDays: 60,
  },
];

const irrigationAddOns: ProjectAddOn[] = [
  {
    id: "technical-report",
    name: "Technical Report (PDF)",
    description: "Structured methodology, architecture, testing and results.",
    price: 39900,
    eligiblePackageIds: ["basic", "standard", "premium"],
    makesPhysical: false,
  },
  {
    id: "presentation",
    name: "Presentation (PPT)",
    description: "Editable project presentation with diagrams and outcomes.",
    price: 24900,
    eligiblePackageIds: ["basic", "standard", "premium"],
    makesPhysical: false,
  },
  {
    id: "editable-source",
    name: "Editable Design / Source Files",
    description: "Editable firmware, diagrams and configuration files.",
    price: 29900,
    eligiblePackageIds: ["basic", "standard", "premium"],
    makesPhysical: false,
  },
  {
    id: "simulation-files",
    name: "Simulation Files (Proteus)",
    description: "Configured simulation project and component setup.",
    price: 39900,
    eligiblePackageIds: ["basic", "standard", "premium"],
    makesPhysical: false,
  },
  {
    id: "hardware-kit",
    name: "Hardware Kit (ESP32 + Sensors)",
    description: "Core components supplied as an unassembled kit.",
    price: 189900,
    eligiblePackageIds: ["basic", "standard", "premium"],
    makesPhysical: true,
  },
  {
    id: "hardware-assembly",
    name: "Hardware Assembly",
    description: "Assembly and hardware-specific customization require feasibility review.",
    price: null,
    eligiblePackageIds: ["standard", "premium"],
    makesPhysical: true,
  },
  {
    id: "installation",
    name: "Installation & Setup Assistance",
    description: "Guided setup session for the selected configuration.",
    price: 29900,
    eligiblePackageIds: ["basic", "standard", "premium"],
    makesPhysical: false,
  },
  {
    id: "extended-support",
    name: "Additional Technical Support",
    description: "Adds 30 days of technical support after delivery.",
    price: 49900,
    eligiblePackageIds: ["basic", "standard", "premium"],
    makesPhysical: false,
  },
];

const irrigationDetail: ProjectDetail = {
  catalog: catalogProjects[0],
  displayTitle: "Smart Irrigation System using ESP32",
  description:
    "An IoT-based irrigation solution that monitors soil moisture and controls a water pump according to configured thresholds, with optional remote monitoring features.",
  hardwarePlatform: "ESP32",
  sourceCodeIncluded: true,
  supportAvailable: true,
  tags: ["IoT & Electronics", "ESP32", "Arduino", "Automation"],
  media: [
    {
      id: "greenhouse-solar",
      imageId: "photo-1758646652209-a7392490ba72",
      alt: "Greenhouse and garden building with solar panels",
      label: "Project environment",
      focus: "50% 52%",
    },
    {
      id: "moisture-sensor",
      imageId: "photo-1584795962384-dce385272216",
      alt: "Plant monitoring sensor installed in a clay pot",
      label: "Soil monitoring",
    },
    {
      id: "controller",
      imageId: "photo-1631376604263-5d803038b389",
      alt: "ESP32 microcontroller board",
      label: "ESP32 controller",
    },
    {
      id: "dashboard",
      imageId: "photo-1551288049-bebda4e38f71",
      alt: "Monitoring dashboard with analytical charts",
      label: "Optional dashboard",
    },
    {
      id: "irrigation",
      imageId: "photo-1623136299195-570a06bdae6b",
      alt: "Rows of healthy plants inside a greenhouse",
      label: "Irrigation environment",
    },
  ],
  packages: irrigationPackages,
  addOns: irrigationAddOns,
  overview: [
    "The system reads a soil-moisture sensor at a configured interval and compares the result with a threshold stored in the ESP32 firmware.",
    "When the measured value falls below that threshold, the controller switches a relay that powers the irrigation pump. The pump stops when the configured condition is satisfied or a safety duration is reached.",
    "Wi-Fi monitoring, dashboard visibility and alternative power arrangements depend on the selected package and add-ons; they are not assumed in the Basic package.",
  ],
  keyFeatures: [
    "Real-time soil moisture measurement",
    "Configurable pump switching thresholds",
    "ESP32-based controller logic",
    "Local relay and water-pump control",
    "Optional Wi-Fi monitoring",
    "Optional alternative power arrangements",
  ],
  mainComponents: [
    "ESP32 development board",
    "Capacitive soil moisture sensor",
    "Relay module",
    "Low-voltage water pump",
    "Tubing and power supply",
  ],
  learningOutcomes: [
    "Sensor calibration and analog input handling",
    "Threshold-based embedded control",
    "Relay isolation and actuator switching",
    "IoT monitoring architecture",
  ],
  techStack: ["ESP32", "Arduino framework", "C++", "Wi-Fi (optional)", "MQTT (optional)"],
  documentation: [
    "Circuit and wiring diagram",
    "Firmware setup guide",
    "Threshold calibration instructions",
    "Package-specific deliverable index",
  ],
  faqs: [
    {
      question: "Is the hardware included?",
      answer:
        "Hardware is included only when the Hardware Kit add-on is selected or a quote explicitly includes assembled hardware.",
    },
    {
      question: "Does Basic include dashboard monitoring?",
      answer:
        "No. Basic includes controller source, circuit and setup documentation. Remote monitoring must be included by a higher package or approved customization.",
    },
    {
      question: "Do defect fixes use a free revision?",
      answer:
        "No. Confirmed defects against the accepted scope are remediation obligations and do not automatically consume the package revision allowance.",
    },
  ],
  diagram: {
    inputs: [{ id: "soil", label: "Soil Moisture Sensor" }],
    controller: { id: "esp32", label: "ESP32 Controller" },
    process: { id: "relay", label: "Relay Module" },
    outputs: [
      { id: "pump", label: "Water Pump" },
      { id: "dashboard", label: "Monitoring Dashboard", optional: true },
    ],
  },
  applications: ["Smart Agriculture", "Home Gardening", "Academic Learning", "Farm Automation"],
};

function genericPackages(project: CatalogProject): ProjectPackage[] {
  const base = project.startingPrice;
  return [
    {
      id: "basic",
      name: "Basic",
      price: base,
      shortDescription: "Core project files and setup documentation",
      deliverables: ["Core project files", "Setup documentation"],
      includedAddOnIds: ["editable-source"],
      freeRevisions: 1,
      revisionWindowDays: 14,
      supportDays: 14,
    },
    {
      id: "standard",
      name: "Standard",
      price: base + 150000,
      shortDescription: "Basic + report and presentation",
      deliverables: ["Everything in Basic", "Technical report", "Presentation"],
      includedAddOnIds: ["editable-source", "technical-report", "presentation"],
      freeRevisions: 2,
      revisionWindowDays: 30,
      supportDays: 30,
    },
    {
      id: "premium",
      name: "Premium",
      price: base + 300000,
      shortDescription: "Extended deliverables and support",
      deliverables: ["Everything in Standard", "Extended setup guidance"],
      includedAddOnIds: ["editable-source", "technical-report", "presentation", "installation"],
      freeRevisions: 3,
      revisionWindowDays: 45,
      supportDays: 60,
    },
  ];
}

function genericDetail(project: CatalogProject): ProjectDetail {
  const included = new Set<CatalogDeliverable>(project.deliverables);
  return {
    catalog: project,
    displayTitle: project.title,
    description: project.summary,
    hardwarePlatform:
      project.technologies.find((item) =>
        ["ESP32", "Arduino", "Raspberry Pi", "VHDL"].includes(item),
      ) ?? "Software-defined",
    sourceCodeIncluded: included.has("source-code"),
    supportAvailable: project.deliverables.includes("installation-guidance"),
    tags: [project.categoryLabel, ...project.technologies.slice(0, 3)],
    media: [
      {
        id: "primary",
        imageId: project.imageId,
        alt: project.imageAlt,
        label: "Project preview",
        focus: project.imageFocus,
      },
    ],
    packages: genericPackages(project),
    addOns: irrigationAddOns.filter(
      (addOn) => !addOn.makesPhysical || project.deliveryType !== "digital",
    ),
    overview: [project.summary],
    keyFeatures: project.searchTerms
      .slice(0, 6)
      .map((item) => item.replace(/\b\w/g, (letter) => letter.toUpperCase())),
    mainComponents: project.technologies,
    learningOutcomes: ["Architecture and system integration", "Configuration and testing workflow"],
    techStack: project.technologies,
    documentation: project.deliverables.map((item) => item.replace(/-/g, " ")),
    faqs: [],
    diagram: {
      inputs: [{ id: "input", label: "Project Input" }],
      controller: { id: "controller", label: "Core Controller" },
      process: { id: "process", label: "Processing Layer" },
      outputs: [{ id: "output", label: "Project Output" }],
    },
    applications: ["Academic Learning", "Prototype Development", "Technical Demonstration"],
  };
}

export function getProjectDetail(slug: string): ProjectDetail | null {
  if (slug === irrigationDetail.catalog.slug || slug === "smart-irrigation-system-using-esp32") {
    return irrigationDetail;
  }
  const project = catalogProjects.find((item) => item.slug === slug);
  return project ? genericDetail(project) : null;
}
