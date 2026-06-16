"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Menu } from "duma-icons-react";
import type { IconMeta } from "duma-icons/metadata";
import { createSearch } from "@/lib/search";
import { Customizer, type Theme } from "./Customizer";
import { CategoryList } from "./CategoryList";
import { IconGrid } from "./IconGrid";
import { IconDetail } from "./IconDetail";

const REPO_URL = "https://github.com/DudychMarian/duma-icons";

export function Gallery({
  icons,
  counts,
}: {
  icons: IconMeta[];
  counts: Record<string, number>;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [color, setColor] = useState("#0a0a0a");
  const [size, setSize] = useState(32);
  const [theme, setThemeState] = useState<Theme>("light");
  const [selected, setSelected] = useState<IconMeta | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // True once the user picks a color by hand — stops the theme from overwriting their choice.
  const [colorCustomized, setColorCustomized] = useState(false);

  // The default icon color follows the active theme: white on dark, near-black on light.
  const themeColor = (t: Theme) => (t === "dark" ? "#ffffff" : "#0a0a0a");

  // Sync from the theme the no-FOUC inline script already resolved (system pref / saved choice).
  useEffect(() => {
    const resolved = (document.documentElement.dataset.theme as Theme) || "light";
    setThemeState(resolved);
    setColor(themeColor(resolved));
  }, []);

  // A manual color pick from the Customizer; flags the color as customized.
  function pickColor(next: string) {
    setColor(next);
    setColorCustomized(true);
  }

  function setTheme(next: Theme) {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("duma-theme", next);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
    // Auto-update the icon fill so it stays visible against the themed canvas —
    // but only while the user hasn't chosen their own color.
    if (!colorCustomized) setColor(themeColor(next));
  }

  function reset() {
    setColor(themeColor(theme));
    setColorCustomized(false);
    setSize(32);
  }

  const search = useMemo(() => createSearch(icons), [icons]);

  const results = useMemo(() => {
    let list = search(query);
    if (category !== "all") list = list.filter((m) => m.category === category);
    return list;
  }, [search, query, category]);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <button
            className="menu-btn"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Menu size={22} />
          </button>
          <div className="logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="duma-logo" width={26} height={26} className="logo-mark" />
            Duma
          </div>
          <a
            className="ghlink"
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            title="View on GitHub"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
            </svg>
          </a>
        </div>
      </header>

      {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}

      <div className="shell">
        <aside className={menuOpen ? "sidebar open" : "sidebar"}>
          <Customizer
            color={color}
            setColor={pickColor}
            size={size}
            setSize={setSize}
            theme={theme}
            setTheme={setTheme}
            onReset={reset}
          />
          <CategoryList
            counts={counts}
            total={icons.length}
            active={category}
            onSelect={(c) => {
              setCategory(c);
              setMenuOpen(false);
            }}
          />
        </aside>

        <main className="main">
          <div className="toolbar">
            <div className="search">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search icons by name, alias or tag…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search icons"
              />
            </div>
            <span className="count">{results.length} icons</span>
          </div>
          <IconGrid icons={results} color={color} size={size} onPick={setSelected} />
        </main>
      </div>

      {selected && (
        <IconDetail
          meta={selected}
          color={color}
          size={size}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
