/**
 * DEMONSTRATION DATA — illustrates the listing format until the published
 * catalog is connected. Not purchasable. Prices are integer minor units (paise).
 * No ratings or discounts are shown because none are verified.
 */
import { catalogProjects, catalogDeliveryLabels, projectTypeLabels } from "./catalog-projects";

export type DeliveryMode = "digital" | "physical" | "hybrid";

export type DemoProject = {
  slug: string;
  title: string;
  categorySlug: string;
  /** Short category chip shown on cards, e.g. "AI/ML". */
  categoryLabel: string;
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
    slug: "smart-greenhouse-monitoring-system",
    title: "Smart Greenhouse Monitoring System",
    categorySlug: "iot-electronics",
    categoryLabel: "IoT",
    stack: ["ESP32", "Soil & climate sensors", "MQTT"],
    typeLabel: "Hardware + Software",
    deliveryMode: "hybrid",
    basePrice: 499900,
    imageId: "photo-1524486361537-8ad15938e1a3",
    imageAlt: "Rows of plants growing inside a glass greenhouse",
    focus: "50% 60%",
  },
  {
    slug: "real-time-object-detection-yolov8",
    title: "Real-Time Object Detection Using YOLOv8",
    categorySlug: "artificial-intelligence-ml",
    categoryLabel: "AI/ML",
    stack: ["Python", "YOLOv8", "OpenCV"],
    typeLabel: "Software",
    deliveryMode: "digital",
    basePrice: 399900,
    imageId: "photo-1602951172321-fe0aa8865e6b",
    imageAlt: "Cars in city traffic, the kind of scene the detector labels",
    focus: "50% 55%",
  },
  {
    slug: "arduino-robotic-arm-object-handling",
    title: "Arduino Based Robotic Arm with Object Handling",
    categorySlug: "robotics",
    categoryLabel: "Robotics",
    stack: ["Arduino", "Servo control", "C++"],
    typeLabel: "Hardware + Software",
    deliveryMode: "hybrid",
    basePrice: 599900,
    imageId: "photo-1655393001768-d946c97d6fd1",
    imageAlt: "Articulated robotic arm on a display stand",
    focus: "50% 45%",
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
      stack: project.technologies,
      typeLabel: `${projectTypeLabels[project.projectType]} · ${catalogDeliveryLabels[project.deliveryType]}`,
      deliveryMode: project.deliveryType,
      basePrice: project.startingPrice,
      imageId: project.imageId,
      imageAlt: project.imageAlt,
      focus: project.imageFocus,
    }));
}
