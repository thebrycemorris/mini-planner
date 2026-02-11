import { useMemo } from "react";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import type { Task } from "../lib/types";
import { daysUntil, dueStatus, todayISO } from "../lib/date";

export default function Dashboard({
  tasks,
  onToggle,
}: {
  tasks: Task[];
  onToggle: (id: string) => void;
}) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const today = tasks.filter((t) => !t.completed && t.dueDate === todayISO()).length;
    const next7 = tasks.filter((t) => !t.completed && daysUntil(t.dueDate) >= 0 && daysUntil(t.dueDate) <= 7).length;
    const overdue = tasks.filter((t) => !t.completed && daysUntil(t.dueDate) < 0).length;
    return { total, completed, today, next7, overdue };
  }, [tasks]);

  const dueSoon = useMemo(() => {
    return tasks
      .filter((t) => !t.completed)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 8);
  }, [tasks]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div className="h1">Dashboard</div>
        <div className="sub">Your quick view for what’s coming up.</div>
      </div>

      <div className="grid grid-5">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Due Today" value={stats.today} />
        <StatCard label="Next 7 Days" value={stats.next7} />
        <StatCard label="Overdue" value={stats.overdue} />
      </div>

      <div className="card">
        <div className="section-title">
          <h2>Due Soon</h2>
          <div className="muted">Top {dueSoon.length} upcoming</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {dueSoon.length === 0 ? (
            <div className="muted">Nothing due soon</div>
          ) : (
            dueSoon.map((t) => {
              const due = dueStatus(t.dueDate);
              return (
                <div key={t.id} className="task-row">
                  <div className="task-left">
                    <button
                      className={`check ${t.completed ? "on" : ""}`}
                      onClick={() => onToggle(t.id)}
                      aria-label="Toggle complete"
                      title="Toggle complete"
                    >
                      {t.completed ? <span className="checkmark" /> : null}
                    </button>

                    <div style={{ minWidth: 0 }}>
                      <div className={`task-title ${t.completed ? "done" : ""}`}>{t.title}</div>
                      <div className="task-meta">
                        <Badge text={t.priority} kind="solid" />
                        {t.course ? <Badge text={t.course} kind="subtle" /> : null}
                        <Badge text={due.label} kind={due.kind} />
                      </div>
                    </div>
                  </div>

                  <div className="task-right">
                    <div className="due-text">Due: {t.dueDate}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
      </div>
      {/* ✅ Quick Tip + What's Next */}
      <div className="dashboard-two">
        <div className="card">
          <div className="section-title">
            <h2>Quick Tip</h2>
            <div className="muted">Tip</div>
          </div>
          <div className="sub" style={{ marginTop: 0 }}>
            Add your real classes + due dates and the calendar auto-fills. It’s the fastest way to make the app actually useful.
          </div>
        </div>

        <div className="card">
          <div className="section-title">
            <h2>What’s Next</h2>
            <div className="muted">Coming soon</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="setting-row">
              <div className="setting-left">
                <div className="setting-title">Daily digest notification</div>
                <div className="setting-desc">One notification per day listing what’s due and due soon.</div>
              </div>
              <span className="badge">Planned</span>
            </div>

            <div className="setting-row">
              <div className="setting-left">
                <div className="setting-title">Now Studying bar</div>
                <div className="setting-desc">A bottom bar like Spotify’s player for your next task.</div>
              </div>
              <span className="badge">Planned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
