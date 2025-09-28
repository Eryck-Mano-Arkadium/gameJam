// src/app/layout.tsx
import "@/styles/global.css.ts";
import "@/styles/fonts.css";
import type { Metadata } from "next";
import SettingsMenu from "@/components/SettingsMenu";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Streak Trivia",
  description: "A synchronized trivia MVP.",
};

// ✅ HOIST THIS (do NOT put dynamic() inside the component)
const MusicPlayer = dynamic(() => import("@/components/MusicPlayer"), {
  ssr: false,
});

// ✅ keep a stable object (no re-creating every render)
const TRACKS = {
  menu: "/audio/menu.mp3",
  daily: "/audio/menu.mp3",
  infinity: "/audio/menu.mp3",
  speed: "/audio/speed.mp3",
  fallback: "/audio/menu.mp3",
} as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SettingsMenu />
        <MusicPlayer tracks={TRACKS} />
      </body>
    </html>
  );
}
