"use client";

import { useState } from "react";
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

  return (
    <>
      {/* FAB (gear) */}
      <button
        aria-label="Open settings"
        className={S.btn}
        onClick={() => setOpen((v) => !v)}
      >
        <img src="/assets/Settings.png" alt="Settings" width={65} height={65} />
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Settings menu"
          style={{
            position: "absolute",
            top: 16,
            left: 72,
            width: 260,
            background: "#fff",
            border: "1px solid #d0d7de",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            padding: 12,
            zIndex: 50,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>Settings</strong>
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
            {/* Home */}
            <Link
              href={HOME_PATH}
              onClick={() => setOpen(false)}
              className="btn"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              Home (modes)
            </Link>

            {/* Sound toggle */}
            <button
              className="btn"
              onClick={() => {
                toggle();
              }}
            >
              {muted ? "Sound: Off" : "Sound: On"}
            </button>

            {/* Name */}
            <Link
              href={NAME_PATH}
              onClick={() => setOpen(false)}
              className="btn"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              Name
            </Link>

            {/* Leaderboards submenu */}
            <div
              className="card"
              style={{
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            >
              <button
                className="btn"
                onClick={() => setShowLB((v) => !v)}
                aria-expanded={showLB}
                aria-controls="submenu-lb"
                style={{ width: "100%" }}
              >
                Leaderboards {showLB ? "▾" : "▸"}
              </button>
              {showLB && (
                <div
                  id="submenu-lb"
                  style={{ marginTop: 8, display: "grid", gap: 6 }}
                >
                  <Link
                    href={DAILY_LB_PATH}
                    onClick={() => setOpen(false)}
                    className="btn"
                    style={{ textDecoration: "none", textAlign: "center" }}
                  >
                    Daily
                  </Link>
                  <Link
                    href={SPEED_LB_PATH}
                    onClick={() => setOpen(false)}
                    className="btn"
                    style={{ textDecoration: "none", textAlign: "center" }}
                  >
                    Speed Run
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
