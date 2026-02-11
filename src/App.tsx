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
import { useAuth } from "./auth/AuthContext";

import type { Priority, Task } from "./lib/types";
import { todayISO } from "./lib/date";
import { createTask, deleteTask, listenToTasks, toggleTask } from "./lib/tasksStore";
import { migrateLocalTasksToFirestore } from "./lib/migrate";

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
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Listen to firestore tasks when logged in
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    // migrate localStorage tasks once
    migrateLocalTasksToFirestore(user.uid).catch(console.error);

    const unsub = listenToTasks(user.uid, setTasks);
    return () => unsub();
  }, [user]);

  async function addTask(input: NewTaskInput) {
    if (!user) return;

    const t: Task = {
      id: makeId(),
      title: input.title.trim(),
      course: input.course.trim(),
      dueDate: input.dueDate || todayISO(),
      priority: input.priority,
      completed: false,
      createdAt: Date.now(),
    };

    await createTask(user.uid, t);
  }

  async function toggleComplete(id: string) {
    if (!user) return;
    const current = tasks.find((t) => t.id === id);
    if (!current) return;
    await toggleTask(user.uid, id, !current.completed);
  }

  async function removeTask(id: string) {
    if (!user) return;
    await deleteTask(user.uid, id);
  }

  return (
    <Routes>
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

