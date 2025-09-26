import "@/styles/global.css.ts";
import "@/styles/fonts.css";
import type { Metadata } from "next";
import SettingsMenu from "@/components/SettingsMenu";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Streak Trivia",
  description: "A synchronized trivia MVP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const MusicPlayer = dynamic(() => import("@/components/MusicPlayer"), {
    ssr: false,
  });
  return (
    <html lang="en">
      <body>
        {children}
        <SettingsMenu />
        {/* Provide track URLs after you add them under public/ */}
        <MusicPlayer
          tracks={{
            menu: "/audio/menu.mp3",
            daily: "/audio/menu.mp3",
            speed: "/audio/speed.mp3",
            infinity: "/audio/menu.mp3",
            fallback: "/audio/menu.mp3",
          }}
        />
      </body>
    </html>
  );
}
