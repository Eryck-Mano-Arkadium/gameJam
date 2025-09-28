"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useSound } from "@/hooks/useSound";
import * as S from "./settings.css";

const HOME_PATH: Route = "/modes";
const NAME_PATH: Route = "/name";
const SPEED_LB_PATH: Route = "/speed/leaderboard";
const DAILY_LB_PATH: Route = "/daily/leaderboard";

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const [showLB, setShowLB] = useState(false);
  const { muted, toggle } = useSound();

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* Floating gear button (top-left) */}
      <button
        aria-label="Open settings"
        className={S.btn}
        onClick={() => setOpen(true)}
      >
        <img src="/assets/Settings.png" alt="" width={65} height={65} />
      </button>

      {/* Scrim */}
      {open && (
        <button
          aria-label="Close settings"
          className={S.scrim}
          onClick={close}
        />
      )}

      {/* Drawer */}
      <aside
        className={`${S.drawer} ${open ? S.drawerOpen : ""}`}
        role="dialog"
        aria-label="Settings"
        aria-modal="true"
      >
        <header className={S.header}>
          <strong className={S.headerTitle}>Menu</strong>
          <button
            className={S.close}
            aria-label="Close"
            onClick={close}
            title="Close"
          >
            ×
          </button>
        </header>

        <nav className={S.list} aria-label="Main">
          {/* Home */}
          <Link href={HOME_PATH} className={S.item} onClick={close}>
            <span className={S.icon} aria-hidden="true">
              <img src="/icons/Home_Icon.svg" alt="" width={32} height={32} />
            </span>
            <span className={S.label}>Home</span>
          </Link>

          {/* Sound */}
          <button
            className={S.item}
            onClick={() => {
              toggle();
            }}
          >
            <span className={S.icon} aria-hidden="true">
              {muted ? (
                <img src="/icons/Mute_Icon.svg" alt="" width={32} height={32} />
              ) : (
                <img
                  src="/icons/Unmute_Icon.svg"
                  alt=""
                  width={32}
                  height={32}
                />
              )}
            </span>
            <span className={S.label}>{muted ? "Unmute" : "Mute"}</span>
          </button>

          {/* Name */}
          <Link href={NAME_PATH} className={S.item} onClick={close}>
            <span className={S.icon} aria-hidden="true">
              <img src="/icons/ChangeName_Icon.svg" alt="" width={32} height={32} />
            </span>
            <span className={S.label}>Change Name</span>
          </Link>

          {/* Leaderboards (submenu) */}
          <button
            className={S.item}
            onClick={() => setShowLB((v) => !v)}
            aria-expanded={showLB}
            aria-controls="submenu-lb"
          >
            <span className={S.icon} aria-hidden="true">
              <img src="/icons/Leaderboard_Icon.svg" alt="" width={32} height={32} />
            </span>
            <span className={S.label}>Leaderboard</span>
            <span className={S.chevron} aria-hidden="true">
              {showLB ? "▾" : "▸"}
            </span>
          </button>

          {showLB && (
            <div
              id="submenu-lb"
              className={S.submenu}
              role="group"
              aria-label="Leaderboards"
            >
              <Link href={DAILY_LB_PATH} className={S.subItem} onClick={close}>
                <span className={S.subLabel}>Daily</span>
              </Link>
              <Link href={SPEED_LB_PATH} className={S.subItem} onClick={close}>
                <span className={S.subLabel}>Speed Run</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Optional footer brand */}
        <footer className={S.footer}>
          <div>
            <img src="/icons/Arkadium_Logo.svg" alt="" width={180}  />
          </div>
          <span>One Minute Trivia</span>
        </footer>
      </aside>
    </>
  );
}
