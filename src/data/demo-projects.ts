/**
 * DEMONSTRATION DATA — illustrates the listing format until the published
 * catalog is connected. Prices are integer minor units (paise).
 */
import { catalogProjects, catalogDeliveryLabels, projectTypeLabels } from "./catalog-projects";

export type DeliveryMode = "digital" | "physical" | "hybrid";

export type DemoProject = {
  slug: string;
  title: string;
  categorySlug: string;
  /** Short category chip shown on cards, e.g. "AI/ML", "Embedded". */
  categoryLabel: string;
  description?: string;
  stack: string[];
  /** Hardware + Software, Software, ... */
  typeLabel: string;
  deliveryMode: DeliveryMode;
  basePrice: number;
  /** Only set when a genuine, approved discount exists. */
  originalPrice?: number;
  imageId: string;
  imageAlt: string;
  focus?: string;
};

export const deliveryModeLabel: Record<DeliveryMode, string> = {
  digital: "Digital delivery",
  physical: "Physical shipment",
  hybrid: "Digital + hardware",
};

export const demoProjects: DemoProject[] = [
  {
    slug: "autonomous-obstacle-avoidance-rover",
    title: "Autonomous Obstacle Avoidance Robot",
    categorySlug: "embedded-systems",
    categoryLabel: "Embedded",
    description: "Arduino based robot with ultrasonic sensing and real-time control.",
    stack: ["Arduino", "Ultrasonic sensor", "Motor driver"],
    typeLabel: "Hardware + Software",
    deliveryMode: "physical",
    basePrice: 249900,
    imageId: "photo-1678225867994-e7a5b071ebfd",
    imageAlt: "Small wheeled robot with ultrasonic sensors and exposed electronics",
    focus: "50% 50%",
  },
  {
    slug: "inventory-management-web-application",
    title: "Student Project Management System",
    categorySlug: "software-development",
    categoryLabel: "Software",
    description: "Web application to manage projects, submissions and evaluations.",
    stack: ["React", "TypeScript", "Node.js"],
    typeLabel: "Software",
    deliveryMode: "digital",
    basePrice: 499900,
    imageId: "photo-1551288049-bebda4e38f71",
    imageAlt: "Student project management system interface on laptop screen",
    focus: "50% 50%",
  },
  {
    slug: "smart-home-automation",
    title: "Smart Home Automation (using ESP32)",
    categorySlug: "iot-electronics",
    categoryLabel: "IoT",
    description: "Control lights, fans and appliances via web and mobile interface.",
    stack: ["ESP32", "Relays", "MQTT"],
    typeLabel: "Hardware + Software",
    deliveryMode: "hybrid",
    basePrice: 399900,
    imageId: "photo-1631378297854-185cff6b0986",
    imageAlt: "Microcontroller prototype with sensors and wiring",
    focus: "50% 50%",
  },
  {
    slug: "arduino-robotic-arm",
    title: "Quadcopter Flight Controller (Academic Build)",
    categorySlug: "robotics",
    categoryLabel: "Robotics",
    description: "A stable and customizable drone platform for academic use.",
    stack: ["Arduino", "Sensors", "Telemetry"],
    typeLabel: "Hardware + Software",
    deliveryMode: "hybrid",
    basePrice: 699900,
    imageId: "photo-1527977966376-1c8408f9f108",
    imageAlt: "Quadcopter flight controller academic build on workbench",
    focus: "50% 50%",
  },
];

export function searchDemoProjects(query: string): DemoProject[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return catalogProjects
    .filter((project) =>
      [
        project.id,
        project.title,
        project.summary,
        project.categoryLabel,
        ...project.technologies,
        ...project.searchTerms,
      ].some((field) => field.toLowerCase().includes(q)),
    )
    .slice(0, 6)
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      categorySlug: project.category,
      categoryLabel: project.categoryLabel,
      description: project.summary,
      stack: project.technologies,
      typeLabel: `${projectTypeLabels[project.projectType]} · ${catalogDeliveryLabels[project.deliveryType]}`,
      deliveryMode: project.deliveryType,
      basePrice: project.startingPrice,
      imageId: project.imageId,
      imageAlt: project.imageAlt,
      focus: project.imageFocus,
    }));
}
