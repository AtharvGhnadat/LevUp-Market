import { categories } from "./categories";

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };

/** Routes follow the PRD route inventory (section 10) where one exists. */
export const resourceLinks: NavLink[] = [
  { label: "Project Guidelines", href: "/resources/project-guidelines" },
  { label: "Technical Articles", href: "/resources/articles" },
  { label: "FAQs", href: "/faq" },
  { label: "Support Center", href: "/contact" },
];

export const primaryNav: NavItem[] = [
  {
    label: "Explore Projects",
    href: "/projects",
    children: [
      { label: "All Projects", href: "/projects" },
      ...categories.map((c) => ({
        label: c.name,
        href: `/projects?category=${c.slug}`,
      })),
    ],
  },
  { label: "Custom Projects", href: "/custom-project" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Resources", href: "/resources", children: resourceLinks },
];

export const footerGroups: Array<{ title: string; links: NavLink[] }> = [
  {
    title: "Explore",
    links: [
      { label: "All Projects", href: "/projects" },
      { label: "Categories", href: "/#categories" },
      { label: "Custom Projects", href: "/custom-project" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing & Packages", href: "/pricing" },
    ],
  },
  { title: "Resources", links: resourceLinks },
  {
    title: "Company",
    links: [
      { label: "About LevUp Projects", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund & Cancellation", href: "/refund-policy" },
      { label: "Shipping & Returns", href: "/shipping-policy" },
      { label: "Project Licensing", href: "/license" },
      { label: "Academic Use Policy", href: "/academic-use" },
    ],
  },
];
