export default function Badge({
  text,
  kind,
}: {
  text: string;
  kind?: "solid" | "subtle" | "overdue" | "today" | "soon" | "later";
}) {
  const k = kind ?? "subtle";

  const className =
    k === "solid"
      ? "badge badge-solid"
      : k === "overdue"
      ? "badge badge-overdue"
      : k === "today"
      ? "badge badge-today"
      : k === "soon"
      ? "badge badge-soon"
      : k === "later"
      ? "badge badge-later"
      : "badge";

  return (
    <span className={className}>
      <span className="badge-dot" />
      {text}
    </span>
  );
}
