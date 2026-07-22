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
  clients: [],
  work: [],
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
    await loadClients();
  }
  // Workers get their assigned tasks; admins get everything
  if (isAdminish() || state.auth.user?.role === "worker") {
    await loadWork();
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
    clients: [],
    work: [],
  });
}
export const logout = doLogout;

/* ---------- Users (admin list; super admin manages) ---------- */
export async function loadUsers() {
  if (!isAdminish()) return;
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

/* ---------- Clients (admin) ---------- */
// Subdocuments (updates/todos) carry Mongo _ids too — normalize those as well.
const normClient = (c) => ({ ...norm(c), updates: (c.updates || []).map(norm) });
const normWork = (p) => ({ ...norm(p), todos: (p.todos || []).map(norm) });

export async function loadClients() {
  if (!isAdminish()) return;
  try {
    const clients = await api("/clients", { auth: true });
    set({ clients: clients.map(normClient) });
  } catch {
    /* 401/403 handled elsewhere */
  }
}

export async function saveClient(data) {
  if (data.id) {
    const updated = normClient(
      await api(`/clients/${data.id}`, { method: "PUT", body: data, auth: true })
    );
    set({ clients: state.clients.map((c) => (c.id === data.id ? updated : c)) });
  } else {
    const created = normClient(
      await api("/clients", { method: "POST", body: data, auth: true })
    );
    set({ clients: [created, ...state.clients] });
  }
}

export async function deleteClient(id) {
  await api(`/clients/${id}`, { method: "DELETE", auth: true });
  set({ clients: state.clients.filter((c) => c.id !== id) });
}

export async function addClientUpdate(id, { text, image }) {
  const updated = normClient(
    await api(`/clients/${id}/updates`, {
      method: "POST",
      body: { text, image },
      auth: true,
    })
  );
  set({ clients: state.clients.map((c) => (c.id === id ? updated : c)) });
  return updated;
}

export async function deleteClientUpdate(id, updateId) {
  const updated = normClient(
    await api(`/clients/${id}/updates/${updateId}`, {
      method: "DELETE",
      auth: true,
    })
  );
  set({ clients: state.clients.map((c) => (c.id === id ? updated : c)) });
}

/* ---------- Work tracking (admin + worker) ---------- */
export async function loadWork() {
  try {
    const work = await api("/work", { auth: true });
    set({ work: work.map(normWork) });
  } catch {
    /* 401/403 handled elsewhere */
  }
}

// Replace one project in the list with the fresh copy the API returned
const swapWork = (updated) =>
  set({ work: state.work.map((p) => (p.id === updated.id ? updated : p)) });

export async function saveWorkProject(data) {
  if (data.id) {
    swapWork(
      normWork(
        await api(`/work/${data.id}`, { method: "PUT", body: data, auth: true })
      )
    );
  } else {
    const created = normWork(
      await api("/work", { method: "POST", body: data, auth: true })
    );
    set({ work: [created, ...state.work] });
  }
}

export async function deleteWorkProject(id) {
  await api(`/work/${id}`, { method: "DELETE", auth: true });
  set({ work: state.work.filter((p) => p.id !== id) });
}

export async function addTodo(projectId, { title, assignedTo }) {
  swapWork(
    normWork(
      await api(`/work/${projectId}/todos`, {
        method: "POST",
        body: { title, assignedTo },
        auth: true,
      })
    )
  );
}

export async function updateTodo(projectId, todoId, patch) {
  swapWork(
    normWork(
      await api(`/work/${projectId}/todos/${todoId}`, {
        method: "PUT",
        body: patch,
        auth: true,
      })
    )
  );
}

export async function deleteTodo(projectId, todoId) {
  swapWork(
    normWork(
      await api(`/work/${projectId}/todos/${todoId}`, {
        method: "DELETE",
        auth: true,
      })
    )
  );
}

/* ---------- Image upload (Cloudinary, signed by our API) ---------- */
// The server only signs the request; the file goes straight from the browser
// to Cloudinary. Throws "Image uploads not configured" when env is missing.
export async function uploadImage(file) {
  const sig = await api("/uploads/signature", { auth: true });
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", sig.timestamp);
  fd.append("folder", sig.folder);
  fd.append("signature", sig.signature);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: fd }
  );
  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.secure_url;
}
