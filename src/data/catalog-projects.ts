/**
 * Structured demonstration catalog.
 *
 * This is deliberately isolated from the UI so Supabase/Payload/API records can
 * replace it without rewriting catalog components. Prices are integer paise.
 * Nothing in this file represents a purchasable or verified listing.
 */
export type CatalogProjectType = "ready-made" | "built-on-order" | "customizable";
export type CatalogDeliveryType = "digital" | "physical" | "hybrid";
export type CatalogDifficulty = "beginner" | "intermediate" | "advanced";
export type CatalogDeliverable =
  | "source-code"
  | "technical-report"
  | "presentation"
  | "simulation-files"
  | "circuit-files"
  | "hardware-kit"
  | "installation-guidance";

export type CatalogProject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  categoryLabel: string;
  projectType: CatalogProjectType;
  deliveryType: CatalogDeliveryType;
  technologies: string[];
  searchTerms: string[];
  difficulty: CatalogDifficulty;
  deliverables: CatalogDeliverable[];
  customizable: boolean;
  packages: Array<"Basic" | "Standard" | "Premium">;
  startingPrice: number;
  createdAt: string;
  recommendedRank: number;
  imageId: string;
  imageAlt: string;
  imageFocus?: string;
};

export const catalogProjects: CatalogProject[] = [
  {
    id: "LP-1001",
    slug: "esp32-smart-irrigation-system",
    title: "ESP32 Smart Irrigation System",
    summary:
      "Soil-moisture-driven irrigation controller with remote monitoring, pump automation and configurable thresholds.",
    category: "iot-electronics",
    categoryLabel: "IoT & Electronics",
    projectType: "built-on-order",
    deliveryType: "hybrid",
    technologies: ["ESP32", "Arduino", "JavaScript / TypeScript"],
    searchTerms: ["soil moisture", "mqtt", "pump", "agriculture", "sensor"],
    difficulty: "intermediate",
    deliverables: [
      "source-code",
      "technical-report",
      "circuit-files",
      "hardware-kit",
      "installation-guidance",
    ],
    customizable: true,
    packages: ["Basic", "Standard", "Premium"],
    startingPrice: 649900,
    createdAt: "2026-10-28",
    recommendedRank: 1,
    imageId: "photo-1524486361537-8ad15938e1a3",
    imageAlt: "Rows of plants inside a monitored greenhouse",
    imageFocus: "50% 58%",
  },
  {
    id: "LP-1002",
    slug: "ai-object-detection-yolo",
    title: "AI Object Detection Using YOLO",
    summary:
      "Real-time object detection pipeline with model configuration, evaluation notebook and an inference interface.",
    category: "artificial-intelligence-ml",
    categoryLabel: "Artificial Intelligence & ML",
    projectType: "ready-made",
    deliveryType: "digital",
    technologies: ["Python", "Other technologies"],
    searchTerms: ["yolo", "opencv", "computer vision", "deep learning", "pytorch"],
    difficulty: "advanced",
    deliverables: ["source-code", "technical-report", "presentation", "installation-guidance"],
    customizable: true,
    packages: ["Basic", "Standard", "Premium"],
    startingPrice: 399900,
    createdAt: "2026-10-20",
    recommendedRank: 2,
    imageId: "photo-1602951172321-fe0aa8865e6b",
    imageAlt: "Vehicles in an urban street scene suitable for object detection",
    imageFocus: "50% 55%",
  },
  {
    id: "LP-1003",
    slug: "arduino-robotic-arm",
    title: "Arduino Robotic Arm",
    summary:
      "Multi-axis servo arm for pick-and-place demonstrations with calibrated motion sequences and assembly guidance.",
    category: "robotics",
    categoryLabel: "Robotics",
    projectType: "built-on-order",
    deliveryType: "hybrid",
    technologies: ["Arduino", "Other technologies"],
    searchTerms: ["servo", "robot arm", "pick and place", "embedded c", "kinematics"],
    difficulty: "intermediate",
    deliverables: [
      "source-code",
      "technical-report",
      "circuit-files",
      "hardware-kit",
      "installation-guidance",
    ],
    customizable: true,
    packages: ["Standard", "Premium"],
    startingPrice: 899900,
    createdAt: "2026-10-14",
    recommendedRank: 3,
    imageId: "photo-1655393001768-d946c97d6fd1",
    imageAlt: "Articulated robotic arm on a display stand",
    imageFocus: "50% 45%",
  },
  {
    id: "LP-1004",
    slug: "smart-home-automation",
    title: "Smart Home Automation",
    summary:
      "Connected lighting, appliance and environment controls with local override and a responsive monitoring dashboard.",
    category: "iot-electronics",
    categoryLabel: "IoT & Electronics",
    projectType: "customizable",
    deliveryType: "hybrid",
    technologies: ["ESP32", "Raspberry Pi", "JavaScript / TypeScript"],
    searchTerms: ["home automation", "mqtt", "relay", "sensor", "dashboard"],
    difficulty: "intermediate",
    deliverables: ["source-code", "technical-report", "circuit-files", "hardware-kit"],
    customizable: true,
    packages: ["Basic", "Standard", "Premium"],
    startingPrice: 749900,
    createdAt: "2026-10-08",
    recommendedRank: 4,
    imageId: "photo-1631378297854-185cff6b0986",
    imageAlt: "Microcontroller prototype with connected wires",
  },
  {
    id: "LP-1005",
    slug: "fpga-traffic-light-controller",
    title: "FPGA Traffic Light Controller",
    summary:
      "Finite-state traffic controller with pedestrian timing, emergency override logic and simulation testbench.",
    category: "embedded-systems",
    categoryLabel: "Embedded Systems",
    projectType: "ready-made",
    deliveryType: "digital",
    technologies: ["VHDL", "Other technologies"],
    searchTerms: ["fpga", "finite state machine", "testbench", "vivado", "digital design"],
    difficulty: "advanced",
    deliverables: ["source-code", "technical-report", "simulation-files", "presentation"],
    customizable: false,
    packages: ["Basic", "Standard"],
    startingPrice: 299900,
    createdAt: "2026-09-29",
    recommendedRank: 6,
    imageId: "photo-1782338938790-9a956490181d",
    imageAlt: "Processor mounted on a printed circuit board",
  },
  {
    id: "LP-1006",
    slug: "matlab-signal-analysis-toolkit",
    title: "MATLAB Signal Analysis Toolkit",
    summary:
      "Reusable scripts and interfaces for filtering, spectrum analysis, feature extraction and comparative plots.",
    category: "simulation-design",
    categoryLabel: "Simulation & Design",
    projectType: "ready-made",
    deliveryType: "digital",
    technologies: ["MATLAB"],
    searchTerms: ["signal processing", "fft", "filter", "dsp", "simulink"],
    difficulty: "intermediate",
    deliverables: ["source-code", "technical-report", "simulation-files", "presentation"],
    customizable: true,
    packages: ["Basic", "Standard", "Premium"],
    startingPrice: 249900,
    createdAt: "2026-10-31",
    recommendedRank: 5,
    imageId: "photo-1526628953301-3e589a6a8b74",
    imageAlt: "Monitoring display with multiple live signal graphs",
  },
  {
    id: "LP-1007",
    slug: "inventory-management-web-application",
    title: "Inventory Management Web Application",
    summary:
      "Role-based stock, supplier and transaction management with searchable records and export-ready reporting.",
    category: "software-development",
    categoryLabel: "Software Development",
    projectType: "customizable",
    deliveryType: "digital",
    technologies: ["JavaScript / TypeScript", "Other technologies"],
    searchTerms: ["react", "node.js", "postgresql", "inventory", "web application"],
    difficulty: "intermediate",
    deliverables: ["source-code", "technical-report", "presentation", "installation-guidance"],
    customizable: true,
    packages: ["Basic", "Standard", "Premium"],
    startingPrice: 349900,
    createdAt: "2026-10-17",
    recommendedRank: 7,
    imageId: "photo-1607706189992-eae578626c86",
    imageAlt: "Web application source code on a monitor",
  },
  {
    id: "LP-1008",
    slug: "solar-energy-monitoring-system",
    title: "Solar Energy Monitoring System",
    summary:
      "Voltage, current and production monitoring with data logging, performance summaries and threshold alerts.",
    category: "iot-electronics",
    categoryLabel: "IoT & Electronics",
    projectType: "built-on-order",
    deliveryType: "physical",
    technologies: ["ESP32", "Arduino"],
    searchTerms: ["solar", "energy meter", "voltage", "current sensor", "renewable energy"],
    difficulty: "intermediate",
    deliverables: ["source-code", "technical-report", "circuit-files", "hardware-kit"],
    customizable: true,
    packages: ["Standard", "Premium"],
    startingPrice: 799900,
    createdAt: "2026-09-18",
    recommendedRank: 8,
    imageId: "photo-1551288049-bebda4e38f71",
    imageAlt: "Energy performance charts on a laptop",
  },
  {
    id: "LP-1009",
    slug: "rectangular-microstrip-patch-antenna",
    title: "Rectangular Microstrip Patch Antenna Simulation",
    summary:
      "Parametric antenna model with substrate configuration, radiation plots and documented simulation procedure.",
    category: "simulation-design",
    categoryLabel: "Simulation & Design",
    projectType: "ready-made",
    deliveryType: "digital",
    technologies: ["MATLAB", "Other technologies"],
    searchTerms: ["antenna", "hfss", "cst", "rf", "microstrip", "electromagnetics"],
    difficulty: "advanced",
    deliverables: ["technical-report", "presentation", "simulation-files", "circuit-files"],
    customizable: true,
    packages: ["Basic", "Standard"],
    startingPrice: 299900,
    createdAt: "2026-09-05",
    recommendedRank: 9,
    imageId: "photo-1595008382755-48b0d68865f6",
    imageAlt: "Three-dimensional engineering model displayed on a laptop",
  },
  {
    id: "LP-1010",
    slug: "raspberry-pi-environment-station",
    title: "Raspberry Pi Environment Station",
    summary:
      "Local weather and air-quality station with sensor collection, historical charts and threshold notifications.",
    category: "embedded-systems",
    categoryLabel: "Embedded Systems",
    projectType: "customizable",
    deliveryType: "hybrid",
    technologies: ["Raspberry Pi", "Python"],
    searchTerms: ["weather", "air quality", "linux", "sensor", "dashboard"],
    difficulty: "beginner",
    deliverables: ["source-code", "technical-report", "hardware-kit", "installation-guidance"],
    customizable: true,
    packages: ["Basic", "Standard", "Premium"],
    startingPrice: 549900,
    createdAt: "2026-10-03",
    recommendedRank: 10,
    imageId: "photo-1553406830-f6e44ac97624",
    imageAlt: "Raspberry Pi single-board computer",
  },
  {
    id: "LP-1011",
    slug: "python-retail-demand-forecasting",
    title: "Python Retail Demand Forecasting",
    summary:
      "Time-series forecasting workflow with preprocessing, model comparison, evaluation and documented inference.",
    category: "artificial-intelligence-ml",
    categoryLabel: "Artificial Intelligence & ML",
    projectType: "ready-made",
    deliveryType: "digital",
    technologies: ["Python"],
    searchTerms: ["forecasting", "xgboost", "time series", "machine learning", "retail"],
    difficulty: "advanced",
    deliverables: ["source-code", "technical-report", "presentation", "installation-guidance"],
    customizable: false,
    packages: ["Basic", "Standard"],
    startingPrice: 449900,
    createdAt: "2026-09-23",
    recommendedRank: 11,
    imageId: "photo-1686061594225-3e92c0cd51b0",
    imageAlt: "Analytical data tables and charts on a computer screen",
  },
  {
    id: "LP-1012",
    slug: "autonomous-obstacle-avoidance-rover",
    title: "Autonomous Obstacle Avoidance Rover",
    summary:
      "Sensor-guided rover with motor control, obstacle avoidance logic and configurable navigation behavior.",
    category: "robotics",
    categoryLabel: "Robotics",
    projectType: "built-on-order",
    deliveryType: "physical",
    technologies: ["Arduino", "Other technologies"],
    searchTerms: ["ultrasonic sensor", "rover", "motor driver", "robot car", "navigation"],
    difficulty: "beginner",
    deliverables: ["source-code", "circuit-files", "hardware-kit", "installation-guidance"],
    customizable: true,
    packages: ["Basic", "Standard"],
    startingPrice: 699900,
    createdAt: "2026-10-11",
    recommendedRank: 12,
    imageId: "photo-1678225867994-e7a5b071ebfd",
    imageAlt: "Small wheeled robot with sensors and exposed electronics",
  },
];

export const projectTypeLabels: Record<CatalogProjectType, string> = {
  "ready-made": "Ready-made",
  "built-on-order": "Built on Order",
  customizable: "Customizable",
};

export const catalogDeliveryLabels: Record<CatalogDeliveryType, string> = {
  digital: "Digital files",
  physical: "Physical hardware",
  hybrid: "Digital + Hardware",
};

export const difficultyLabels: Record<CatalogDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const deliverableLabels: Record<CatalogDeliverable, string> = {
  "source-code": "Source code",
  "technical-report": "Technical report",
  presentation: "Presentation",
  "simulation-files": "Simulation files",
  "circuit-files": "Circuit/design files",
  "hardware-kit": "Hardware kit",
  "installation-guidance": "Installation guidance",
};
