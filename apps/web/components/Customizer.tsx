"use client";

import { useEffect, useState } from "react";
import { Rotate } from "duma-icons-react";

export type Theme = "light" | "dark";

export function Customizer({
  color,
  setColor,
  size,
  setSize,
  theme,
  setTheme,
  onReset,
}: {
  color: string;
  setColor: (c: string) => void;
  size: number;
  setSize: (n: number) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  onReset: () => void;
}) {
  // Local text for the hex field so partial typing doesn't fight the color input.
  const [hex, setHex] = useState(color);
  useEffect(() => setHex(color), [color]);

  // One-shot spin on the reset icon each time it's pressed.
  const [spinning, setSpinning] = useState(false);

  function onHexChange(value: string) {
    const v = value.startsWith("#") || value === "" ? value : `#${value}`;
    setHex(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) setColor(v);
  }

  function handleReset() {
    setSpinning(true);
    onReset();
  }

  return (
    <section className="customizer" aria-label="Customize icons">
      <div className="cz-header">
        <h3>Customizer</h3>
        <button className="cz-reset" aria-label="Reset to defaults" title="Reset" onClick={handleReset}>
          <span
            className={spinning ? "cz-reset-icon spin" : "cz-reset-icon"}
            onAnimationEnd={() => setSpinning(false)}
          >
            <Rotate size={18} />
          </span>
        </button>
      </div>

      <div className="cz-field">
        <div className="cz-row">
          <label htmlFor="icon-color">Color</label>
          <div className="cz-color">
            <span className="cz-color-chip">
              <input
                type="color"
                id="icon-color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                aria-label="Pick color"
              />
            </span>
            <input
              type="text"
              className="cz-hex"
              value={hex}
              onChange={(e) => onHexChange(e.target.value)}
              spellCheck={false}
              aria-label="Hex color"
            />
          </div>
        </div>
      </div>

      <div className="cz-field">
        <div className="cz-row">
          <label htmlFor="size">Size</label>
          <span className="cz-val">{size}px</span>
        </div>
        <input
          id="size"
          className="cz-range"
          type="range"
          min={16}
          max={96}
          step={4}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          aria-label="Icon size"
        />
      </div>

      <div className="cz-field">
        <div className="cz-row">
          <label>Theme</label>
        </div>
        <div className="cz-seg" role="group" aria-label="Theme">
          {(["light", "dark"] as Theme[]).map((t) => (
            <button key={t} aria-pressed={theme === t} onClick={() => setTheme(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
