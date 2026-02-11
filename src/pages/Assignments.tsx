import { useMemo, useState } from "react";
import Badge from "../components/Badge";
import { dueStatus, todayISO, daysUntil } from "../lib/date";
import type { Priority, Task } from "../lib/types";

type Props = {
  tasks: Task[];
  onAdd: (input: { title: string; course: string; dueDate: string; priority: Priority }) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function Assignments({ tasks, onAdd, onToggle, onDelete }: Props) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState(todayISO());
  const [priority, setPriority] = useState<Priority>("Medium");
  const [filter, setFilter] = useState<"All" | "Today" | "Next 7 Days" | "Overdue" | "Completed">("All");

  function add() {
    const t = title.trim();
    if (!t) return;

    onAdd({ title: t, course, dueDate, priority });
    setTitle("");
    setCourse("");
    setDueDate(todayISO());
    setPriority("Medium");
  }

  const visible = useMemo(() => {
    return [...tasks].filter((t) => {
      const d = daysUntil(t.dueDate);
      if (filter === "All") return true;
      if (filter === "Completed") return t.completed;
      if (filter === "Today") return !t.completed && t.dueDate === todayISO();
      if (filter === "Next 7 Days") return !t.completed && d >= 0 && d <= 7;
      if (filter === "Overdue") return !t.completed && d < 0;
      return true;
    });
  }, [tasks, filter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div className="h1">Assignments</div>
        <div className="sub">Add, filter, and manage everything you have due.</div>
      </div>

      <div className="card">
        <div className="section-title">
          <h2>Add Task</h2>
          <div className="muted">Quick input</div>
        </div>

        <div className="form-grid">
          <div className="field full">
            <div className="label">Title</div>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., CSC 4101 Homework 2" />
          </div>

          <div className="field">
            <div className="label">Course</div>
            <input className="input" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g., CSC 4101" />
          </div>

          <div className="field">
            <div className="label">Due Date</div>
            <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div className="field">
            <div className="label">Priority</div>
            <select className="input" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="field">
            <div className="label">&nbsp;</div>
            <button className="btn btn-primary" onClick={add}>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="chips">
        {(["All", "Today", "Next 7 Days", "Overdue", "Completed"] as const).map((k) => (
          <button key={k} className={`chip ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>
            {k}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="section-title">
          <h2>Your List</h2>
          <div className="muted">{visible.length} shown</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {visible.length === 0 ? (
            <div className="muted">Nothing here yet.</div>
          ) : (
            visible
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
              .map((t) => {
                const due = dueStatus(t.dueDate);
                return (
                  <div key={t.id} className="task-row">
                    <div className="task-left">
                      <button className={`check ${t.completed ? "on" : ""}`} onClick={() => onToggle(t.id)} aria-label="Toggle complete">
                        {t.completed ? <span className="checkmark" /> : null}
                      </button>

                      <div style={{ minWidth: 0 }}>
                        <div className={`task-title ${t.completed ? "done" : ""}`}>{t.title}</div>
                        <div className="task-meta">
                          <Badge text={t.priority} kind="solid" />
                          {t.course ? <Badge text={t.course} kind="subtle" /> : null}
                          <Badge text={due.label} kind={due.kind} />
                        </div>
                        <div className="due-text">Due: {t.dueDate}</div>
                      </div>
                    </div>

                    <div className="task-right">
                      <button className="btn btn-secondary" onClick={() => onDelete(t.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}
