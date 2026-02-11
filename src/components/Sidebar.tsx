import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <span className="brand-dot" />
          <div className="brand-title">Mini Planner</div>
        </div>
        <div className="brand-sub">Student Planner made easy</div>
      </div>

      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          Dashboard
        </NavLink>
        <NavLink to="/assignments" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          Assignments
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          Calendar
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          Settings
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
        Profile
        </NavLink>

      </nav>

      <div className="sidebar-card">
        <div className="sidebar-card-title">FOCUS MODE</div>
        <div className="sidebar-card-main">7-day reminders</div>
        <div className="sidebar-card-sub">
          Keeps upcoming deadlines visible before they become stressful.
        </div>
      </div>
    </aside>
  );
}
