import type { SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  /** Scales the longest side; the other follows the viewBox ratio. Default 24. */
  size?: number | string;
  /** Resolves `currentColor`. Default "currentColor" (inherits CSS `color`). */
  color?: string;
  /** Accessible label. When set, renders <title> + role="img"; else aria-hidden. */
  title?: string;
}
