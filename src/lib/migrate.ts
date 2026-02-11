import type { Task } from "./types";
import { loadTasks, saveTasks } from "./storage";
import { createTask } from "./tasksStore";

const MIGRATION_KEY = "planner_tasks_migrated_v1";

export async function migrateLocalTasksToFirestore(uid: string) {
  const already = localStorage.getItem(MIGRATION_KEY);
  if (already === uid) return; // already migrated for this user

  const local = loadTasks();
  if (local.length === 0) {
    localStorage.setItem(MIGRATION_KEY, uid);
    return;
  }

  // push tasks to firestore
  await Promise.all(local.map((t) => createTask(uid, t)));

  // optional: clear local tasks after migration
  saveTasks([]);
  localStorage.setItem(MIGRATION_KEY, uid);
}
