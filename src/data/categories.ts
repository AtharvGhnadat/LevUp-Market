export type Category = {
  slug: string;
  /** Display name, split where the reference wraps onto two lines. */
  name: string;
  lines: [string, string?];
  imageId: string;
  imageAlt: string;
  /** object-position for the card crop */
  focus?: string;
};

export const categories: Category[] = [
  {
    slug: "software-development",
    name: "Software Development",
    lines: ["Software", "Development"],
    imageId: "photo-1515879218367-8466d910aaa4",
    imageAlt: "Laptop screen showing application source code",
    focus: "50% 40%",
  },
  {
    slug: "artificial-intelligence-ml",
    name: "Artificial Intelligence & ML",
    lines: ["Artificial", "Intelligence & ML"],
    imageId: "photo-1697577418970-95d99b5a55cf",
    imageAlt: "Processor chip marked AI on a circuit board",
  },
  {
    slug: "iot-electronics",
    name: "IoT & Electronics",
    lines: ["IoT &", "Electronics"],
    imageId: "photo-1555664424-778a1e5e1b48",
    imageAlt: "Arduino board, sensors and electronic modules laid out on a table",
  },
  {
    slug: "embedded-systems",
    name: "Embedded Systems",
    lines: ["Embedded", "Systems"],
    imageId: "photo-1782338938790-9a956490181d",
    imageAlt: "Microcontroller chip on a printed circuit board",
  },
  {
    slug: "robotics",
    name: "Robotics",
    lines: ["Robotics"],
    imageId: "photo-1637002722490-5f8ceed9774c",
    imageAlt: "Orange articulated robotic arm",
    focus: "50% 35%",
  },
  {
    slug: "simulation-design",
    name: "Simulation & Design",
    lines: ["Simulation &", "Design"],
    imageId: "photo-1595008382755-48b0d68865f6",
    imageAlt: "3D vehicle model displayed in design software on a laptop",
  },
];
