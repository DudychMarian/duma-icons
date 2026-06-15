import { forwardRef } from "react";
import type { IconProps } from "./types.js";

export interface BaseIconProps extends IconProps {
  viewBox: string;
  /** Optimized inner SVG markup (currentColor + namespaced ids). */
  body: string;
}

function computeDimensions(viewBox: string, size: number | string) {
  const parts = viewBox.split(/\s+/).map(Number);
  const vbW = parts[2] || 1;
  const vbH = parts[3] || 1;
  const n = typeof size === "number" ? size : parseFloat(size) || 24;
  return vbW >= vbH
    ? { width: n, height: Math.round((n * vbH) / vbW) }
    : { width: Math.round((n * vbW) / vbH), height: n };
}

function escapeTitle(t: string) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Shared SVG shell. The icon body is injected via dangerouslySetInnerHTML so
 * complex source markup (<g>, <defs>, <clipPath>) renders intact. Color comes
 * from the `color` prop (resolving the body's currentColor); size scales the
 * longest side while preserving the original aspect ratio.
 */
export const Icon = forwardRef<SVGSVGElement, BaseIconProps>(function Icon(
  { viewBox, body, size = 24, color = "currentColor", title, ...rest },
  ref,
) {
  const { width, height } = computeDimensions(viewBox, size);
  const html = title ? `<title>${escapeTitle(title)}</title>${body}` : body;
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={height}
      fill="none"
      color={color}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});
