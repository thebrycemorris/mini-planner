export type Priority = "Low" | "Medium" | "High";

export type Task = {
  id: string;
  title: string;
  course: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  createdAt: number;
};
