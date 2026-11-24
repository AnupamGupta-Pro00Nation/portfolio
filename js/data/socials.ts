export interface Social {
  platform: string;
  url: string;
  displayValue: string;
  icon?: string;
}

export const socials: Social[] = [
  {
    platform: "Email",
    url: "mailto:guptaanupam552@gmail.com",
    displayValue: "guptaanupam552@gmail.com",
    icon: "mail"
  },
  {
    platform: "GitHub",
    url: "https://github.com/AnupamGupta-Pro00Nation",
    displayValue: "github.com/AnupamGupta-Pro00Nation",
    icon: "github"
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/anupam-gupta-9294a234a/",
    displayValue: "linkedin.com/in/anupam-gupta-9294a234a",
    icon: "linkedin"
  },
  {
    platform: "Location",
    url: "#",
    displayValue: "Jhansi / Mathura, UP, India",
    icon: "map-pin"
  }
];
