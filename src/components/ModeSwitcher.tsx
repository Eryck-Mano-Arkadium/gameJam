import { resolveHref } from "@/utils/nav";

export default function ModeSwitcher() {
  return (
    <div className="card" aria-labelledby="mode-switcher">
      <h2 id="mode-switcher">Mode Switcher</h2>
      <div className="row">
        <a className="btn" href={resolveHref("/infinity")}>
          Infinity
        </a>
        <a className="btn" href={resolveHref("/daily")}>
          Daily
        </a>
        <a className="btn" href={resolveHref("/speed")}>
          Speed Run
        </a>
      </div>
    </div>
  );
}
