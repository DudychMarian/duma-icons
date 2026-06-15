"use client";

import { toSvg, dimensions, type IconData } from "duma-icons";

export function svgString(icon: IconData, color: string, size: number): string {
  const svg = toSvg(icon, { color, size });
  // Bake the chosen color into the body so the exported SVG is self-contained and
  // shows the configured color everywhere, not only where `currentColor` resolves.
  return color && color !== "currentColor" ? svg.replace(/currentColor/g, color) : svg;
}

function triggerDownload(filename: string, url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadSvg(icon: IconData, slug: string, color: string, size: number) {
  const svg = svgString(icon, color, size);
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  triggerDownload(`${slug}.svg`, url);
  URL.revokeObjectURL(url);
}

/** Rasterize the SVG to PNG client-side at the requested scale, honoring color. */
export function downloadPng(
  icon: IconData,
  slug: string,
  color: string,
  size: number,
  scale = 4,
): Promise<void> {
  const { width, height } = dimensions(icon.viewBox, size);
  const svg = svgString(icon, color, size);
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no 2d context"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("toBlob failed"));
        const url = URL.createObjectURL(blob);
        triggerDownload(`${slug}.png`, url);
        URL.revokeObjectURL(url);
        resolve();
      }, "image/png");
    };
    img.onerror = () => reject(new Error("svg load failed"));
    img.src = src;
  });
}

export function jsxSnippet(name: string, color: string, size: number): string {
  const props: string[] = [];
  if (size !== 24) props.push(`size={${size}}`);
  if (color !== "currentColor") props.push(`color="${color}"`);
  return `<${name} ${props.join(" ")}`.trimEnd() + " />";
}
