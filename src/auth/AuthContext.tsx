import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";

type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  username: string | null; // stored in Firestore
};

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  signUp: (input: { email: string; password: string; username: string }) => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadUsername(uid: string): Promise<string | null> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as { username?: string };
  return data.username ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [fbUser, setFbUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (u) => {
    setFbUser(u);

    try {
      if (u) {
        const un = await loadUsername(u.uid);
        setUsername(un);
      } else {
        setUsername(null);
      }
    } catch (err) {
      console.error("Failed to load profile from Firestore:", err);
      // IMPORTANT: don't hang the app if Firestore blocks/errs
      setUsername(null);
    } finally {
      setLoading(false);
    }
  });

  return () => unsub();
}, []);


  async function signUp(input: { email: string; password: string; username: string }) {
    const cred = await createUserWithEmailAndPassword(auth, input.email, input.password);

    // Set displayName on Auth user (nice for UI)
    await updateProfile(cred.user, { displayName: input.username });

    // Store username in Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      username: input.username,
      createdAt: Date.now(),
    });

    setUsername(input.username);
  }

  async function signIn(input: { email: string; password: string }) {
    await signInWithEmailAndPassword(auth, input.email, input.password);
    // username will load via listener
  }

  async function signInWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);

    // Ensure Firestore user doc exists
    const ref = doc(db, "users", cred.user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const fallback =
        cred.user.displayName?.replace(/\s+/g, "").toLowerCase() ??
        (cred.user.email ? cred.user.email.split("@")[0] : "user");

      await setDoc(ref, { username: fallback, createdAt: Date.now() });
    }

    const un = await loadUsername(cred.user.uid);
    setUsername(un);
  }

  async function logout() {
    await signOut(auth);
  }

  const user: AppUser | null = useMemo(() => {
    if (!fbUser) return null;
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName,
      username,
    };
  }, [fbUser, username]);

  const value: AuthContextValue = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
