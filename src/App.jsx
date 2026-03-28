// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import ComplaintRegister from "./components/students/complaintRegister";
import AdminLogin from "./components/admin/AdminLogin";
import SuperAdminDashboard from "./components/admin/SuperAdminDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

import { Client, Account } from "appwrite";

/* ─────────────────────────────────────────────────────
   APPWRITE CLIENT
───────────────────────────────────────────────────── */
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

const account = new Account(client);

/* ─────────────────────────────────────────────────────
   ADMIN EMAIL / ROLE MAP  (from .env — optional)
───────────────────────────────────────────────────── */
const ADMIN_EMAILS = (import.meta.env.VITE_APPWRITE_ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const ADMIN_MAP = (import.meta.env.VITE_APPWRITE_ADMIN_MAP || "")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean)
  .reduce((acc, pair) => {
    const [email, role] = pair.split(":").map((x) => x.trim());
    if (email && role) acc[email.toLowerCase()] = role;
    return acc;
  }, {});

/* ─────────────────────────────────────────────────────
   ROLE DETECTOR
───────────────────────────────────────────────────── */
function detectRoleFromUser(user) {
  if (!user) return null;
  try {
    const prefs = user.prefs;
    if (prefs) {
      const obj = typeof prefs === "string" ? JSON.parse(prefs) : prefs;
      if (obj?.role) return obj.role;
      if (Array.isArray(obj?.roles) && obj.roles.length) return obj.roles[0];
    }
  } catch {}
  if (typeof user.role === "string") return user.role;
  if (user.email) {
    const lower = user.email.toLowerCase();
    if (ADMIN_MAP[lower]) return ADMIN_MAP[lower];
    if (ADMIN_EMAILS.includes(user.email)) return "college-admin";
  }
  return null;
}

/* ─────────────────────────────────────────────────────
   LOGIN WRAPPER
───────────────────────────────────────────────────── */
function LoginWrapper({ setUser }) {
  const navigate = useNavigate();
  return (
    <LoginPage
      onLogin={(u) => {
        setUser(u);
        navigate("/complaints");
      }}
      onCancel={() => navigate("/")}
    />
  );
}

/* ─────────────────────────────────────────────────────
   DYNAMIC ADMIN ROUTE
   Handles ALL admin URLs with a single component:
     /admin          → auto-detect dept from user.prefs.college
     /admin/hostel   → category = "hostel"
     /admin/food     → category = "food"
     /admin/super    → SuperAdminDashboard
     /admin/<xyz>    → any new dept, zero code changes needed
───────────────────────────────────────────────────── */
function DynamicAdminRoute({ user, role: roleProp }) {
  const { dept }  = useParams();   // "hostel" | "food" | "super" | undefined
  const location  = useLocation();

  if (!user) return <Navigate to="/admin/login" replace />;

  const params       = new URLSearchParams(location.search);
  const overrideRole = params.get("role");
  const finalRole    = overrideRole || roleProp || detectRoleFromUser(user);

  // /admin/super  OR  role === "super-admin"
  if (dept === "Super" || finalRole === "Super") {
    return <SuperAdminDashboard user={user} role="super-admin" />;
  }

  // Everything else → one AdminDashboard
  // category = URL segment if present, else AdminDashboard reads user.prefs.college
  return <AdminDashboard user={user} category={dept} />;
}

/* ─────────────────────────────────────────────────────
   APP
───────────────────────────────────────────────────── */
export default function App() {
  const [user,            setUser]            = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [role,            setRole]            = useState(null);

  useEffect(() => {
    let mounted = true;
    async function restoreSession() {
      try {
        const u = await account.get();
        if (!mounted) return;
        setUser(u);
        setRole(detectRoleFromUser(u));
      } catch {
        setUser(null);
        setRole(null);
      } finally {
        if (mounted) setCheckingSession(false);
      }
    }
    restoreSession();
    return () => { mounted = false; };
  }, []);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking session...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/"           element={<HomePage onShowLogin={() => (window.location.href = "/login")} />} />
        <Route path="/login"      element={<LoginWrapper setUser={setUser} />} />
        <Route path="/complaints" element={<ComplaintRegister user={user} isAdmin={role === "super-admin"} />} />

        {/* ── Admin login ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── TWO routes, ONE component — covers every department ──
            /admin         → dept = undefined → reads prefs.college
            /admin/:dept   → dept = "hostel" / "food" / "super" / anything
            No more hardcoded routes ever needed.                    */}
        <Route
          path="/admin"
          element={
            user
              ? <DynamicAdminRoute user={user} role={role} />
              : <Navigate to="/admin/login" replace />
          }
        />
        <Route
          path="/admin/:dept"
          element={
            user
              ? <DynamicAdminRoute user={user} role={role} />
              : <Navigate to="/admin/login" replace />
          }
        />

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}