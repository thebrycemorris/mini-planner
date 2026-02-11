export function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function daysUntil(dueDate: string): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [y, m, d] = dueDate.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  const ms = due.getTime() - start.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function dueStatus(dueDate: string) {
  const d = daysUntil(dueDate);
  if (d < 0) return { label: `Overdue (${Math.abs(d)}d)`, kind: "overdue" as const };
  if (d === 0) return { label: "Due today", kind: "today" as const };
  if (d <= 7) return { label: `Due in ${d}d`, kind: "soon" as const };
  return { label: `Due in ${d}d`, kind: "later" as const };
}
