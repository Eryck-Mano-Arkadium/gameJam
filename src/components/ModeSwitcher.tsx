import NavLink from "@/components/NavLink";

export default function ModeSwitcher() {
  return (
    <div className="card" aria-labelledby="mode-switcher">
      <h2 id="mode-switcher">Mode Switcher</h2>
      <div className="row">
        <NavLink className="btn" to="/infinity">
          Infinity
        </NavLink>
        <NavLink className="btn" to="/daily">
          Daily
        </NavLink>
        <NavLink className="btn" to="/speed">
          Speed Run
        </NavLink>
      </div>
    </div>
  );
}
