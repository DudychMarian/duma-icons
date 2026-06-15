import type { IconData } from "./types.js";

export interface ToSvgOptions {
  /** Scales the longest side; the other side follows the viewBox ratio. Default 24. */
  size?: number | string;
  /** Resolves `currentColor`. Default "currentColor" (inherits CSS). */
  color?: string;
}

/** Compute width/height from a viewBox so non-square icons never distort. */
export function dimensions(
  viewBox: string,
  size: number | string = 24,
): { width: number; height: number } {
  const parts = viewBox.split(/\s+/).map(Number);
  const vbW = parts[2] || 1;
  const vbH = parts[3] || 1;
  const n = typeof size === "number" ? size : parseFloat(size) || 24;
  if (vbW >= vbH) {
    return { width: n, height: Math.round((n * vbH) / vbW) };
  }
  return { width: Math.round((n * vbW) / vbH), height: n };
}

/** Serialize an icon to a standalone SVG string (used for copy / download). */
export function toSvg(icon: IconData, options: ToSvgOptions = {}): string {
  const { size = 24, color = "currentColor" } = options;
  const { width, height } = dimensions(icon.viewBox, size);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" ` +
    `width="${width}" height="${height}" fill="none" color="${color}">` +
    `${icon.body}</svg>`
  );
}
