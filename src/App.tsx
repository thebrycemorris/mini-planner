import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";

import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import AuthPage from "./pages/Auth";

import ProtectedRoute from "./auth/ProtectedRoute";

import type { Priority, Task } from "./lib/types";
import { loadTasks, saveTasks } from "./lib/storage";
import { todayISO } from "./lib/date";

function makeId() {
  return String(Date.now()) + Math.random().toString(16).slice(2);
}

type NewTaskInput = {
  title: string;
  course: string;
  dueDate: string;
  priority: Priority;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => setTasks(loadTasks()), []);
  useEffect(() => saveTasks(tasks), [tasks]);

  function addTask(input: NewTaskInput) {
    const t: Task = {
      id: makeId(),
      title: input.title.trim(),
      course: input.course.trim(),
      dueDate: input.dueDate || todayISO(),
      priority: input.priority,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [t, ...prev]);
  }

  function toggleComplete(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <Routes>
      {/* App pages (protected) */}
      <Route
        path="/"
        element={
          <AppShell>
              <Dashboard tasks={tasks} onToggle={toggleComplete} />
          </AppShell>
        }
      />

      <Route
        path="/assignments"
        element={
          <AppShell>
              <Assignments
                tasks={tasks}
                onAdd={addTask}
                onToggle={toggleComplete}
                onDelete={removeTask}
              />
          </AppShell>
        }
      />

      <Route
        path="/calendar"
        element={
          <AppShell>
              <Calendar tasks={tasks} />
          </AppShell>
        }
      />

      <Route
        path="/settings"
        element={
          <AppShell>
              <Settings />
          </AppShell>
        }
      />

      <Route path="/auth" element={<AuthPage />} />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell>
              <Dashboard tasks={tasks} onToggle={toggleComplete} />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/assignments"
        element={
          <ProtectedRoute>
            <AppShell>
              <Assignments tasks={tasks} onAdd={addTask} onToggle={toggleComplete} onDelete={removeTask} />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <AppShell>
              <Calendar tasks={tasks} />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppShell>
              <Settings />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppShell>
              <Profile />
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

