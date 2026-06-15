import type { ComponentType } from "react";
import * as ReactIcons from "duma-icons-react";
import * as Core from "duma-icons";
import { metadata } from "duma-icons/metadata";
import type { IconMeta } from "duma-icons/metadata";
import type { IconData } from "duma-icons";
import type { IconProps } from "duma-icons-react";

export type IconComponent = ComponentType<IconProps>;

const components = ReactIcons as unknown as Record<string, IconComponent>;
const core = Core as unknown as Record<string, IconData>;

/** "ArrowRight" -> "arrowRight" (core data export key). */
function camelName(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

export function getComponent(name: string): IconComponent | undefined {
  return components[name];
}

export function getData(name: string): IconData | undefined {
  return core[camelName(name)];
}

export const categories: string[] = Array.from(
  new Set(metadata.map((m) => m.category)),
).sort();

export function countByCategory(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const m of metadata) out[m.category] = (out[m.category] ?? 0) + 1;
  return out;
}

export { metadata };
export type { IconMeta };
