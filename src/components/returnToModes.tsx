"use client";

import { usePathname } from "next/navigation";
import type { Route } from "next";
import * as S from "./returnToModes.css";
import Link from "next/link";

const HOME_PATH: Route = "/modes";

function normalize(p?: string | null) {
  if (!p) return "/";
  return p !== "/" ? p.replace(/\/+$/, "") : "/";
}

export default function BackFab({
  hideOn = ["/", "/welcome", "/modes"],
}: {
  hideOn?: string[];
}) {
  const pathname = normalize(usePathname());
  const hide = new Set(hideOn.map(normalize));

  if (hide.has(pathname)) return null;

  return (
    <Link
      href={HOME_PATH}
      className={S.fab}
      aria-label="Back to game modes"
      title="Back to modes"
    >
      <svg viewBox="0 0 24 24" className={S.icon} aria-hidden="true">
        <path d="M14.7 5.3a1 1 0 0 1 0 1.4L10.4 11H20a1 1 0 1 1 0 2h-9.6l4.3 4.3a1 1 0 1 1-1.4 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.4 0z" />
      </svg>
    </Link>
  );
}
