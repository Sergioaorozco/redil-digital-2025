import type { HTMLAttributeAnchorTarget } from "react";
import type { LucideIcon } from "lucide-react";

export interface cardProps {
  title: string;
  image: any;
  alt: string;
  link?: string;
  icon?: LucideIcon;
  target?: HTMLAttributeAnchorTarget;
  disabled?: boolean;
}

export interface iconCardProps {
  title: string;
  description: string;
  href?: string;
  url?: string;
  icon: LucideIcon;
  target?: HTMLAttributeAnchorTarget;
  disabled?: boolean;
  [key: string]: any;
}