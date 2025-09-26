import "@/styles/global.css.ts";
import type { Metadata } from "next";
import SettingsMenu from "@/components/SettingsMenu";

export const metadata: Metadata = {
  title: "Streak Trivia",
  description: "A synchronized trivia MVP.",
};

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
      </body>
    </html>
  );
}
