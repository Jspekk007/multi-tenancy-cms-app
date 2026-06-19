export type SidebarItem = {
  label: string;
  href: string;
  alternativeText: string;
  icon: string;
};

export type SidebarItems = SidebarItem[];

export interface SidebarProps {
  items: SidebarItems;
}
