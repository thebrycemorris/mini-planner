import { useMemo, useState } from "react";
import Badge from "../components/Badge";
import { dueStatus } from "../lib/date";
import type { Task } from "../lib/types";

function monthLabel(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
}

function toISO(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function startWeekday(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).getDay();
}

export default function Calendar({ tasks }: { tasks: Task[] }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) {
      const list = map.get(t.dueDate) ?? [];
      list.push(t);
      map.set(t.dueDate, list);
    }
    for (const [k, list] of map.entries()) {
      list.sort((a, b) => Number(a.completed) - Number(b.completed));
      map.set(k, list);
    }
    return map;
  }, [tasks]);

  const grid = useMemo(() => {
    const total = daysInMonth(year, month);
    const start = startWeekday(year, month);
    const cells: Array<{ date: string | null }> = [];
    for (let i = 0; i < start; i++) cells.push({ date: null });
    for (let d = 1; d <= total; d++) cells.push({ date: toISO(new Date(year, month, d)) });
    while (cells.length % 7 !== 0) cells.push({ date: null });
    return cells;
  }, [year, month]);

  function prevMonth() {
    const d = new Date(year, month, 1);
    d.setMonth(d.getMonth() - 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function nextMonth() {
    const d = new Date(year, month, 1);
    d.setMonth(d.getMonth() + 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div className="h1">Calendar</div>
        <div className="sub">Month view of your due dates.</div>
      </div>

      <div className="card">
        <div className="cal-head">
          <button className="btn btn-secondary" onClick={prevMonth}>
            ← Prev
          </button>
          <div className="cal-title">{monthLabel(year, month)}</div>
          <button className="btn btn-secondary" onClick={nextMonth}>
            Next →
          </button>
        </div>

        <div style={{ height: 12 }} />

        {/* ✅ Responsive wrapper: keeps 7 columns readable on small screens */}
        <div className="cal-scroll">
          <div className="cal-weekdays">
            {weekdays.map((w) => (
              <div key={w} className="cal-weekday">
                {w}
              </div>
            ))}
          </div>

          <div style={{ height: 10 }} />

          <div className="cal-grid">
            {grid.map((cell, idx) => {
              const list = cell.date ? tasksByDate.get(cell.date) ?? [] : [];
              const dayNum = cell.date ? Number(cell.date.slice(-2)) : null;

              return (
                <div key={idx} className={`cal-cell ${cell.date ? "" : "cal-empty"}`}>
                  {cell.date ? (
                    <>
                      <div className="cal-top">
                        <div className="cal-daynum">{dayNum}</div>
                        {list.length ? <Badge text={`${list.length}`} kind="solid" /> : null}
                      </div>

                      <div className="cal-events">
                        {list.slice(0, 2).map((t) => {
                          const due = dueStatus(t.dueDate);
                          return (
                            <div key={t.id} className="cal-mini">
                              <div
                                className="cal-mini-title"
                                style={{
                                  textDecoration: t.completed ? "line-through" : "none",
                                  opacity: t.completed ? 0.55 : 1,
                                }}
                              >
                                {t.title}
                              </div>

                              <div className="cal-tags">
                                {t.course ? <Badge text={t.course} kind="subtle" /> : null}
                                <Badge text={due.label} kind={due.kind} />
                              </div>
                            </div>
                          );
                        })}

                        {list.length > 2 ? <div className="muted small">+{list.length - 2} more</div> : null}
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
