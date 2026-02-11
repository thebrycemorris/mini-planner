import type { Task } from "./types";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import { db } from "./firebase";

export function tasksCollection(uid: string) {
  return collection(db, "users", uid, "tasks");
}

export function listenToTasks(uid: string, cb: (tasks: Task[]) => void): Unsubscribe {
  const q = query(tasksCollection(uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const tasks = snap.docs.map((d) => d.data() as Task);
    cb(tasks);
  });
}

export async function createTask(uid: string, task: Task) {
  const ref = doc(db, "users", uid, "tasks", task.id);
  await setDoc(ref, task);
}

export async function toggleTask(uid: string, id: string, completed: boolean) {
  const ref = doc(db, "users", uid, "tasks", id);
  await updateDoc(ref, { completed });
}

export async function deleteTask(uid: string, id: string) {
  const ref = doc(db, "users", uid, "tasks", id);
  await deleteDoc(ref);
}
