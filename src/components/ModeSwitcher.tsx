export default function ModeSwitcher() {
  return (
    <div className="card" aria-labelledby="mode-switcher">
      <h2 id="mode-switcher">Mode Switcher</h2>
      <div className="row">
        <a className="btn" href="/infinity">
          Infinity
        </a>
        <a className="btn" href="/daily">
          Daily
        </a>
        <a className="btn" href="/speed">
          Speed Run
        </a>
      </div>
    </div>
  );
}
