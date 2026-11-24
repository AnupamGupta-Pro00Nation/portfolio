export interface NavLink {
  label: string;
  href: string;
  type: 'route' | 'scroll';
  activeId?: string;
}

export const navLinks: NavLink[] = [
  { label: "DASHBOARD", href: "#/dashboard", type: "route", activeId: "nav-item-dashboard" },
  { label: "ABOUT", href: "#about-section", type: "scroll" },
  { label: "PROJECTS", href: "#projects-section", type: "scroll" },
  { label: "EXPERIENCE", href: "#experience-section", type: "scroll" },
  { label: "SANDBOX", href: "#/sandbox", type: "route", activeId: "nav-item-sandbox" },
  { label: "SHELL", href: "#/terminal", type: "route", activeId: "nav-item-terminal" }
];
