import { useEffect, useMemo, useState } from "react";

type SettingsModel = {
  notificationsEnabled: boolean;
  reminderTime: string;
  remindDaysAhead: number;
};

const SETTINGS_KEY = "planner_settings_v1";

function loadSettings(): SettingsModel {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return { notificationsEnabled: false, reminderTime: "09:00", remindDaysAhead: 7 };

  try {
    return JSON.parse(raw) as SettingsModel;
  } catch {
    return { notificationsEnabled: false, reminderTime: "09:00", remindDaysAhead: 7 };
  }
}

function saveSettings(s: SettingsModel) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsModel>(() => loadSettings());
  const [statusMsg, setStatusMsg] = useState<string>("");

  useEffect(() => saveSettings(settings), [settings]);

  const browserSupport = useMemo(() => {
    const supported = "Notification" in window;
    const perm = supported ? Notification.permission : "unsupported";
    return { supported, perm };
  }, []);

  async function enableNotificationsFlow() {
    setStatusMsg("");
    if (!("Notification" in window)) {
      setStatusMsg("Notifications are not supported in this browser.");
      return;
    }

    const res = await Notification.requestPermission();
    if (res !== "granted") {
      setSettings((p) => ({ ...p, notificationsEnabled: false }));
      setStatusMsg("Permission not granted. Notifications remain off.");
      return;
    }

    setSettings((p) => ({ ...p, notificationsEnabled: true }));
    setStatusMsg("Notifications enabled!");

    new Notification("Mini Planner", { body: "Daily reminders are ready." });
  }

  function toggleNotifications() {
    if (!settings.notificationsEnabled) {
      void enableNotificationsFlow();
    } else {
      setSettings((p) => ({ ...p, notificationsEnabled: false }));
      setStatusMsg("Notifications turned off.");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div className="h1">Settings</div>
        <div className="sub">Customize reminders and app behavior.</div>
      </div>

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="section-title">
          <h2>Notifications</h2>
          <div className="muted">
            Support: {browserSupport.supported ? "Yes" : "No"} • Permission: {browserSupport.perm}
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-left">
            <div className="setting-title">Enable notifications</div>
            <div className="setting-desc">
              Browser notifications work best on desktop Chrome/Edge. Phone support varies.
            </div>
          </div>

          <button
            className={`toggle ${settings.notificationsEnabled ? "on" : ""}`}
            onClick={toggleNotifications}
            aria-label="Toggle notifications"
            title="Toggle notifications"
          />
        </div>

        <div className="kv">
          <div className="field">
            <div className="label">Daily reminder time</div>
            <input
              className="input"
              type="time"
              value={settings.reminderTime}
              onChange={(e) => setSettings((p) => ({ ...p, reminderTime: e.target.value }))}
            />
            <div className="muted">Used for your daily “what’s due” digest.</div>
          </div>

          <div className="field">
            <div className="label">Remind days ahead</div>
            <input
              className="input"
              type="number"
              min={1}
              max={30}
              value={settings.remindDaysAhead}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  remindDaysAhead: Math.max(1, Math.min(30, Number(e.target.value || 7))),
                }))
              }
            />
            <div className="muted">Default is 7 days.</div>
          </div>
        </div>

        {statusMsg ? <div className="callout">{statusMsg}</div> : null}

        {!browserSupport.supported ? (
          <div className="warn">
            Your browser doesn’t support notifications. The app still works, but reminders won’t pop up.
          </div>
        ) : null}
      </div>
    </div>
  );
}
