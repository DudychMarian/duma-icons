import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Duma Icons",
  description: "A hand-drawn icon set — browse, recolor, resize and download.",
  icons: { icon: "/logo.svg" },
};

// Resolve the saved theme (or the OS preference) and set it before first paint,
// so there's no flash of the wrong theme on load.
const themeScript = `(function(){try{var t=localStorage.getItem('duma-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
