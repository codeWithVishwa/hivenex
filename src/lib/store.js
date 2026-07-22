import { useSyncExternalStore } from "react";

const API = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "hivenex_token";
const USER_KEY = "hivenex_user";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
}

let state = {
  services: [],
  posts: [],
  projects: [],
  faqs: [],
  stats: [],
  registrations: [],
  users: [],
  auth: {
    loggedIn: !!localStorage.getItem(TOKEN_KEY),
    user: readStoredUser(),
  },
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
    const [services, posts, projects, faqs, stats] = await Promise.all([
      api("/services"),
      api("/posts"),
      api("/projects"),
      api("/faqs"),
      api("/stats"),
    ]);
    set({
      services: services.map(norm),
      posts: posts.map(norm),
      projects: projects.map(norm),
      faqs: faqs.map(norm),
      stats: stats.map(norm),
      loading: false,
      error: null,
    });
  } catch (e) {
    set({ loading: false, error: e.message });
  }
}

const isAdminish = () =>
  ["admin", "super_admin"].includes(state.auth.user?.role);

export async function loadRegistrations() {
  if (!token() || !isAdminish()) return;
  try {
    const regs = await api("/registrations", { auth: true });
    set({ registrations: regs.map(norm) });
  } catch {
    /* 401/403 handled elsewhere */
  }
}

// Load the data appropriate to the current role
async function loadRoleData() {
  if (isAdminish()) {
    await loadRegistrations();
    await loadUsers();
  }
}

// Verify the stored token and refresh the current user
async function restoreSession() {
  if (!token()) return;
  try {
    const { user } = await api("/auth/me", { auth: true });
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ auth: { loggedIn: true, user } });
    await loadRoleData();
  } catch {
    doLogout();
  }
}

loadPublic();
restoreSession();

/* ---------- Auth ---------- */
export async function login(username, password) {
  try {
    const { token: t, user } = await api("/auth/login", {
      method: "POST",
      body: { username, password },
    });
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ auth: { loggedIn: true, user } });
    await loadRoleData();
    return true;
  } catch {
    return false;
  }
}

function doLogout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  set({
    auth: { loggedIn: false, user: null },
    registrations: [],
    users: [],
  });
}
export const logout = doLogout;

/* ---------- Users (super admin) ---------- */
export async function loadUsers() {
  if (state.auth.user?.role !== "super_admin") return;
  try {
    const users = await api("/users", { auth: true });
    set({ users: users.map(norm) });
  } catch {
    /* ignore */
  }
}

export async function createUser(data) {
  const created = norm(
    await api("/users", { method: "POST", body: data, auth: true })
  );
  set({ users: [...state.users, created] });
}

export async function deleteUser(id) {
  await api(`/users/${id}`, { method: "DELETE", auth: true });
  set({ users: state.users.filter((u) => u.id !== id) });
}

export async function resetUserPassword(id, password) {
  await api(`/users/${id}/password`, {
    method: "PUT",
    body: { password },
    auth: true,
  });
}

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
    content: data.content,
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

/* ---------- Generic collection CRUD (projects, faqs, stats) ---------- */
function makeCrud(key, endpoint) {
  const save = async (data) => {
    if (data.id) {
      const updated = norm(
        await api(`/${endpoint}/${data.id}`, {
          method: "PUT",
          body: data,
          auth: true,
        })
      );
      set({ [key]: state[key].map((x) => (x.id === data.id ? updated : x)) });
    } else {
      const created = norm(
        await api(`/${endpoint}`, { method: "POST", body: data, auth: true })
      );
      set({ [key]: [...state[key], created] });
    }
  };
  const remove = async (id) => {
    await api(`/${endpoint}/${id}`, { method: "DELETE", auth: true });
    set({ [key]: state[key].filter((x) => x.id !== id) });
  };
  return { save, remove };
}

const projectsCrud = makeCrud("projects", "projects");
export const saveProject = projectsCrud.save;
export const deleteProject = projectsCrud.remove;

const faqsCrud = makeCrud("faqs", "faqs");
export const saveFaq = faqsCrud.save;
export const deleteFaq = faqsCrud.remove;

const statsCrud = makeCrud("stats", "stats");
export const saveStat = statsCrud.save;
export const deleteStat = statsCrud.remove;

// Fetch a single post (used by the blog detail page on direct navigation)
export async function fetchPost(id) {
  const inStore = state.posts.find((p) => p.id === id);
  if (inStore && inStore.content !== undefined) return inStore;
  return norm(await api(`/posts/${id}`));
}

// Fetch a single project (used by the case-study page on direct navigation).
// The public list already carries every field, so a hit in the store is
// complete; only a cold/direct load needs the network.
export async function fetchProject(id) {
  const inStore = state.projects.find((p) => p.id === id);
  if (inStore && inStore.overview !== undefined) return inStore;
  return norm(await api(`/projects/${id}`));
}

/* ---------- Analytics ---------- */
export function trackPageview(path) {
  // fire-and-forget; never blocks or throws
  try {
    fetch(API + "/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ path, ref: document.referrer || "" }),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export async function loadAnalytics() {
  return api("/analytics", { auth: true });
}
