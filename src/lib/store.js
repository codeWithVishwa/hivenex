import { useSyncExternalStore } from "react";

const API = "/api";
const TOKEN_KEY = "hivenex_token";

let state = {
  services: [],
  posts: [],
  registrations: [],
  auth: { loggedIn: !!localStorage.getItem(TOKEN_KEY) },
  loading: true,
  error: null,
};

const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
function set(patch) {
  state = { ...state, ...patch };
  emit();
}

function subscribe(l) {
  listeners.add(l);
  return () => listeners.delete(l);
}
const getSnapshot = () => state;

export function useDB() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/* ---------- API helper ---------- */
const token = () => localStorage.getItem(TOKEN_KEY);
// Mongo returns `_id`; expose a stable `id` to the UI.
const norm = (d) => ({ ...d, id: d._id ?? d.id });

async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (auth) headers.Authorization = `Bearer ${token()}`;

  const res = await fetch(API + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth) {
    doLogout();
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

/* ---------- Initial load ---------- */
export async function loadPublic() {
  try {
    const [services, posts] = await Promise.all([
      api("/services"),
      api("/posts"),
    ]);
    set({
      services: services.map(norm),
      posts: posts.map(norm),
      loading: false,
      error: null,
    });
  } catch (e) {
    set({ loading: false, error: e.message });
  }
}

export async function loadRegistrations() {
  if (!token()) return;
  try {
    const regs = await api("/registrations", { auth: true });
    set({ registrations: regs.map(norm) });
  } catch {
    /* 401 already handled in api() */
  }
}

loadPublic();
if (token()) loadRegistrations();

/* ---------- Auth ---------- */
export async function login(password) {
  try {
    const { token: t } = await api("/auth/login", {
      method: "POST",
      body: { password },
    });
    localStorage.setItem(TOKEN_KEY, t);
    set({ auth: { loggedIn: true } });
    await loadRegistrations();
    return true;
  } catch {
    return false;
  }
}

function doLogout() {
  localStorage.removeItem(TOKEN_KEY);
  set({ auth: { loggedIn: false }, registrations: [] });
}
export const logout = doLogout;

/* ---------- Registrations ---------- */
export async function addRegistration(data) {
  return api("/registrations", { method: "POST", body: data });
}

export async function deleteRegistration(id) {
  await api(`/registrations/${id}`, { method: "DELETE", auth: true });
  set({ registrations: state.registrations.filter((r) => r.id !== id) });
}

/* ---------- Services ---------- */
export async function saveService(data) {
  const tags =
    typeof data.tags === "string"
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : data.tags || [];
  const body = { title: data.title, desc: data.desc, tags };

  if (data.id) {
    const updated = norm(
      await api(`/services/${data.id}`, { method: "PUT", body, auth: true })
    );
    set({
      services: state.services.map((s) => (s.id === data.id ? updated : s)),
    });
  } else {
    const created = norm(
      await api("/services", { method: "POST", body, auth: true })
    );
    set({ services: [...state.services, created] });
  }
}

export async function deleteService(id) {
  await api(`/services/${id}`, { method: "DELETE", auth: true });
  set({ services: state.services.filter((s) => s.id !== id) });
}

/* ---------- Posts ---------- */
export async function savePost(data) {
  const body = {
    title: data.title,
    category: data.category,
    excerpt: data.excerpt,
    date: data.date,
    read: data.read,
    featured: !!data.featured,
  };

  if (data.id) {
    await api(`/posts/${data.id}`, { method: "PUT", body, auth: true });
  } else {
    await api("/posts", { method: "POST", body, auth: true });
  }
  // featured is exclusive server-side, so refetch for a consistent list
  const posts = await api("/posts");
  set({ posts: posts.map(norm) });
}

export async function deletePost(id) {
  await api(`/posts/${id}`, { method: "DELETE", auth: true });
  set({ posts: state.posts.filter((p) => p.id !== id) });
}
