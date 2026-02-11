import { useLocation } from "react-router-dom";

export default function Topbar() {
  const { pathname } = useLocation();

  const title =
    pathname === "/"
      ? "Dashboard"
      : pathname === "/assignments"
      ? "Assignments"
      : pathname === "/calendar"
      ? "Calendar"
      : pathname === "/profile"
      ? "Profile"
      : "Settings";

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div>
          <div className="kicker">Mini Planner</div>
          <h2 className="page-title">{title}</h2>
        </div>
      </div>
    </div>
  );
}
