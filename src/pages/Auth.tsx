import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as any;

  const redirectTo = useMemo(() => loc.state?.from ?? "/", [loc.state]);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [err, setErr] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setErr("");
    setBusy(true);
    try {
      if (mode === "signup") {
        const un = username.trim();
        if (!un) throw new Error("Username is required.");
        await signUp({ email: email.trim(), password, username: un });
      } else {
        await signIn({ email: email.trim(), password });
      }
      nav(redirectTo, { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setErr("");
    setBusy(true);
    try {
      await signInWithGoogle();
      nav(redirectTo, { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Google sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div className="h1">{mode === "signup" ? "Create your account" : "Welcome back"}</div>
          <div className="sub">Sign in to sync your planner across devices later.</div>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="chips">
            <button className={`chip ${mode === "signin" ? "active" : ""}`} onClick={() => setMode("signin")}>
              Sign In
            </button>
            <button className={`chip ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")}>
              Sign Up
            </button>
          </div>

          {mode === "signup" ? (
            <div className="field">
              <div className="label">Username</div>
              <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g., brycemorris" />
              <div className="muted">Stored in your profile (Firestore).</div>
            </div>
          ) : null}

          <div className="field">
            <div className="label">Email</div>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </div>

          <div className="field">
            <div className="label">Password</div>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {err ? <div className="warn">{err}</div> : null}

          <button className="btn btn-primary" onClick={submit} disabled={busy}>
            {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>

          <button className="btn btn-secondary" onClick={google} disabled={busy}>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
