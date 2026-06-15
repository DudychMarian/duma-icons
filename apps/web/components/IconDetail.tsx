"use client";

import { useEffect, useState } from "react";
import { Cross } from "duma-icons-react";
import type { IconMeta } from "duma-icons/metadata";
import { getComponent, getData } from "@/lib/icons";
import { downloadPng, downloadSvg, svgString, jsxSnippet } from "@/lib/download";

export function IconDetail({
  meta,
  color,
  size,
  onClose,
}: {
  meta: IconMeta;
  color: string;
  size: number;
  onClose: () => void;
}) {
  const Icon = getComponent(meta.name);
  const data = getData(meta.name);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function copy(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }

  const importLine = `import { ${meta.name} } from "duma-icons-react";`;
  const usage = jsxSnippet(meta.name, color, size);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>{meta.name}</h2>
          <button className="close" aria-label="Close" onClick={onClose}>
            <Cross size={16} />
          </button>
        </header>

        <div className="preview">{Icon ? <Icon size={Math.min(size * 2, 120)} color={color} /> : null}</div>

        <div className="actions">
          {data && (
            <>
              <button className="btn" onClick={() => copy("svg", svgString(data, color, size))}>
                {copied === "svg" ? "Copied!" : "Copy SVG"}
              </button>
              <button className="btn" onClick={() => copy("jsx", usage)}>
                {copied === "jsx" ? "Copied!" : "Copy JSX"}
              </button>
              <button className="btn primary" onClick={() => downloadSvg(data, meta.slug, color, size)}>
                Download SVG
              </button>
              <button className="btn primary" onClick={() => void downloadPng(data, meta.slug, color, size, 4)}>
                Download PNG
              </button>
            </>
          )}
        </div>

        <pre className="code">{importLine + "\n\n" + usage}</pre>

        <p className="meta">
          <strong>Category:</strong> {meta.category.replace(/-/g, " ")}
          {meta.aliases.length > 0 && (
            <>
              <br />
              <strong>Also found as:</strong> {meta.aliases.join(", ")}
            </>
          )}
          <br />
          <strong>Tags:</strong> {meta.tags.join(", ")}
        </p>
      </div>
    </div>
  );
}
