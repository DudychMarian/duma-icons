"use client";

import { memo } from "react";
import type { IconMeta } from "duma-icons/metadata";
import { getComponent } from "@/lib/icons";

// Cap the in-grid preview so large sizes never overflow the tile; the detail
// view and downloads still use the exact configured size.
const MAX_PREVIEW = 48;

const Tile = memo(function Tile({
  meta,
  color,
  size,
  onPick,
}: {
  meta: IconMeta;
  color: string;
  size: number;
  onPick: (m: IconMeta) => void;
}) {
  const Icon = getComponent(meta.name);
  return (
    <button className="tile" title={meta.name} onClick={() => onPick(meta)}>
      {Icon ? <Icon size={Math.min(size, MAX_PREVIEW)} color={color} /> : null}
      <span className="name">{meta.slug}</span>
    </button>
  );
});

export function IconGrid({
  icons,
  color,
  size,
  onPick,
}: {
  icons: IconMeta[];
  color: string;
  size: number;
  onPick: (m: IconMeta) => void;
}) {
  if (icons.length === 0) {
    return <p className="empty">No icons match your search.</p>;
  }
  return (
    <div className="grid">
      {icons.map((m) => (
        <Tile key={m.slug} meta={m} color={color} size={size} onPick={onPick} />
      ))}
    </div>
  );
}
