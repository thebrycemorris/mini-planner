import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div className="h1">Profile</div>
        <div className="sub">Your account info.</div>
      </div>

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="setting-row">
          <div className="setting-left">
            <div className="setting-title">Username</div>
            <div className="setting-desc">{user.username ?? "—"}</div>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-left">
            <div className="setting-title">Email</div>
            <div className="setting-desc">{user.email ?? "—"}</div>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={logout}>
          Sign out
        </button>
      </div>
    </div>
  );
}
