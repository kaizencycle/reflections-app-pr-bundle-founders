// auth.ts
type JwtPayload = { sub: string; exp: number; roles?: string[]; tier?: string; [k: string]: any; };
type User = { id: string; email: string; name?: string | null; roles?: string[]; };
type AuthBundle = { accessToken: string; refreshToken?: string; user?: User };

const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_BASE || "";
const USE_COOKIE_REFRESH = (process.env.NEXT_PUBLIC_USE_COOKIE_REFRESH || "false") === "true";
const CLOCK_SKEW_SEC = 30;

type AuthEvent = "change" | "login" | "logout";
type Listener<T = any> = (payload: T) => void;
const listeners: Record<AuthEvent, Set<Listener>> = { change: new Set(), login: new Set(), logout: new Set() };

export function onAuth<T = any>(event: AuthEvent, cb: Listener<T>) {
  listeners[event].add(cb as Listener);
  return () => listeners[event].delete(cb as Listener);
}
function emit<T>(event: AuthEvent, payload?: T) {
  listeners[event].forEach(cb => { try { cb(payload); } catch {} });
}

const mem: Record<string, any> = {};
const store = {
  get<T>(k: string): T | null { try { return JSON.parse(localStorage.getItem(k)!) as T; } catch { return mem[k] ?? null; } },
  set(k: string, v: any) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { mem[k] = v; } },
  del(k: string) { try { localStorage.removeItem(k); } catch { mem[k] = null; } }
};
const KEYS = { access: "auth.access", refresh: "auth.refresh", user: "auth.user" };

function parseJwt(token: string): JwtPayload | null {
  try { return JSON.parse(atob(token.split(".")[1])) as JwtPayload; } catch { return null; }
}
function isExpired(token?: string | null) {
  if (!token) return true;
  const p = parseJwt(token); if (!p?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return (p.exp - CLOCK_SKEW_SEC) <= now;
}

export function getAccessToken(){ return store.get<string>(KEYS.access); }
export function getRefreshToken(){ return store.get<string>(KEYS.refresh); }
export function getUser(){ return store.get<User>(KEYS.user); }
export function isAuthenticated(){ const t = getAccessToken(); return !!t && !isExpired(t); }
export function hasRole(role: string){ return !!getUser()?.roles?.includes(role); }

async function postJson<T>(path: string, body?: any, headers: HeadersInit = {}): Promise<T> {
  const res = await fetch(AUTH_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body || {}),
    credentials: USE_COOKIE_REFRESH ? "include" : "same-origin"
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} — ${await res.text().catch(()=> "")}`);
  return res.json() as Promise<T>;
}

function saveSession(bundle: Partial<AuthBundle>) {
  if (bundle.accessToken) store.set(KEYS.access, bundle.accessToken);
  if (!USE_COOKIE_REFRESH && bundle.refreshToken) store.set(KEYS.refresh, bundle.refreshToken);
  if (bundle.user !== undefined) store.set(KEYS.user, bundle.user);
  emit("change", { authenticated: isAuthenticated(), user: getUser() });
}
function clearSession() {
  store.del(KEYS.access); store.del(KEYS.refresh); store.del(KEYS.user);
  emit("change", { authenticated: false, user: null });
}

export async function register(payload: Record<string, any>) {
  const data = await postJson<AuthBundle>("/auth/register", payload);
  if (data.accessToken) saveSession(data);
  return data;
}
export async function login(credentials: { email: string; password: string; }) {
  const data = await postJson<AuthBundle>("/auth/login", credentials);
  saveSession(data); emit("login", { user: data.user }); return data.user;
}

let refreshing: Promise<string> | null = null;
export async function refresh(): Promise<string> {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    if (USE_COOKIE_REFRESH) {
      const data = await postJson<AuthBundle>("/auth/refresh");
      saveSession(data); return data.accessToken!;
    } else {
      const r = getRefreshToken(); if (!r) throw new Error("No refresh token");
      const data = await postJson<AuthBundle>("/auth/refresh", { refreshToken: r });
      saveSession(data); return data.accessToken!;
    }
  })().finally(() => { refreshing = null; });
  return refreshing;
}

export async function logout() {
  try {
    if (USE_COOKIE_REFRESH) await postJson("/auth/logout", {});
    else { const r = getRefreshToken(); if (r) await postJson("/auth/logout", { refreshToken: r }); }
  } catch {}
  clearSession(); emit("logout", {});
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  let access = getAccessToken();
  if (!access || isExpired(access)) { try { access = await refresh(); } catch { clearSession(); } }
  const headers = new Headers(init.headers || {}); if (access) headers.set("Authorization", `Bearer ${access}`);
  const res = await fetch(input, { ...init, headers, credentials: init.credentials || "same-origin" });

  if (res.status === 401) {
    try {
      const newAccess = await refresh();
      const retryHeaders = new Headers(init.headers || {}); retryHeaders.set("Authorization", `Bearer ${newAccess}`);
      return await fetch(input, { ...init, headers: retryHeaders, credentials: init.credentials || "same-origin" });
    } catch { clearSession(); }
  }
  return res;
}

export const api = {
  get: (url: string) => authFetch(url, { method: "GET" }),
  post: (url: string, body?: any) => authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  })
};
