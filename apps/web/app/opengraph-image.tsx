import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";
import { SITE_NAME, ICON_COUNT, CATEGORY_COUNT } from "@/lib/site";

export const alt = `${SITE_NAME} — free hand-drawn SVG & React icons`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Embed the brand mark as a data URI — Satori can't fetch local files, so read it at build time.
const logo = readFileSync(join(process.cwd(), "public/logo.svg"), "utf-8");
const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0b0b0d",
          backgroundImage:
            "radial-gradient(900px circle at 85% 12%, rgba(98,238,204,0.18), transparent 45%), radial-gradient(900px circle at 10% 100%, rgba(55,147,255,0.20), transparent 45%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUri} width={76} height={76} alt="" />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {SITE_NAME}
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 920,
            }}
          >
            {`${ICON_COUNT} hand-drawn icons`}
          </div>
          <div style={{ fontSize: 36, color: "#a1a1aa", maxWidth: 900, lineHeight: 1.3 }}>
            {`Free & open source · ${CATEGORY_COUNT} categories · recolor, resize & download`}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}>
          <span style={{ color: "#fafafa", fontWeight: 600 }}>duma-icons</span>
          <span style={{ color: "#52525b" }}>·</span>
          <span style={{ color: "#fafafa", fontWeight: 600 }}>duma-icons-react</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
