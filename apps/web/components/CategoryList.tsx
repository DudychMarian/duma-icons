"use client";

export function CategoryList({
  counts,
  total,
  active,
  onSelect,
}: {
  counts: Record<string, number>;
  total: number;
  active: string;
  onSelect: (c: string) => void;
}) {
  const cats = Object.keys(counts).sort();
  return (
    <nav className="panel" aria-label="Categories">
      <h3>Categories</h3>
      <ul className="cats">
        <li>
          <button aria-pressed={active === "all"} onClick={() => onSelect("all")}>
            <span>All</span>
            <span className="num">{total}</span>
          </button>
        </li>
        {cats.map((c) => (
          <li key={c}>
            <button aria-pressed={active === c} onClick={() => onSelect(c)}>
              <span>{c.replace(/-/g, " ")}</span>
              <span className="num">{counts[c]}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
