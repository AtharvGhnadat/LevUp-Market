import { categories } from "./categories";

export type NavLink = { label: string; href: string };

/** Routes follow the PRD route inventory (section 10) where one exists. */
export const resourceLinks: NavLink[] = [
  { label: "Project Guidelines", href: "/resources/project-guidelines" },
  { label: "Technical Articles", href: "/resources/articles" },
  { label: "FAQs", href: "/faq" },
  { label: "Support Center", href: "/contact" },
];

export const allProjectsLink: NavLink = { label: "All projects", href: "/projects" };

export const projectCategoryLinks = categories.map(({ slug, name }) => ({
  slug,
  label: name,
  href: `/projects?category=${slug}`,
}));

export const primaryNav: NavLink[] = [
  { label: "Custom development", href: "/custom-project" },
  { label: "How it works", href: "/#how-it-works" },
];

export function currentProjectLink(path: string, search: string): string | undefined {
  if (path !== allProjectsLink.href) return;
  const category = new URLSearchParams(search).get("category");
  return category
    ? projectCategoryLinks.find(({ slug }) => slug === category)?.href
    : allProjectsLink.href;
}

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
