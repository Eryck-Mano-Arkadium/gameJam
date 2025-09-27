// src/app/modes/page.tsx
import * as S from "./modes.css";
import { resolveHref } from "@/utils/nav";

type Mode = {
  title: string;
  desc?: string;
  href: string;
  iconSrc: string; // PNG path from /public
  iconAlt: string;
};

const MODES: Mode[] = [
  {
    title: "Daily Challenge",
    desc: "One shared puzzle per day.",
    href: "/daily",
    iconSrc: "/assets/modes/daily.png",
    iconAlt: "Daily calendar icon",
  },
  {
    title: "Speed Run",
    desc: "Answer as many as you can before time runs out.",
    href: "/speed",
    iconSrc: "/assets/modes/speed.png",
    iconAlt: "Hourglass icon",
  },
  {
    title: "Infinity",
    desc: "Join the global loop; synchronized rounds.",
    href: "/infinity",
    iconSrc: "/assets/modes/infinity.png",
    iconAlt: "Infinity symbol",
  },
];

function ModeCard({ title, desc, href, iconSrc, iconAlt }: Mode) {
  return (
    <div className={S.card}>
      <div className={S.iconWrap} aria-hidden="true">
        <img className={S.iconImg} src={iconSrc} alt="" />
      </div>
     
      <a
        href={resolveHref(href)}
        className={S.playBtn}
        aria-label={`Play ${title}`}
      >
        <img className={S.iconImg} src={"/assets/Play_Button.png"} alt="" />
      </a>
    </div>
  );
}

export default function ModesPage() {
  return (
    <main className={S.screen}>
      <h1 className={S.title}>Select game mode</h1>
      <section className={S.grid} aria-label="Game modes">
        {MODES.map((m) => (
          <ModeCard key={m.title} {...m} />
        ))}
      </section>
    </main>
  );
}
