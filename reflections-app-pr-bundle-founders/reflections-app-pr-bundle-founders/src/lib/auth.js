/* auth.js — drop-in auth utility
   - Register, login, logout
   - Access/Refresh token handling
   - Auto-refresh by exp or on 401
   - Fetch wrapper that injects Bearer token
*/

const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_BASE || process.env.AUTH_BASE || "";
const USE_COOKIE_REFRESH = (process.env.NEXT_PUBLIC_USE_COOKIE_REFRESH || "false") === "true"; // if your refresh token is httpOnly cookie
const CLOCK_SKEW_SEC = 30; // refresh a bit before expiry

// ---- lightweight event bus ----
const listeners = {};
export function onAuth(event, cb){ (listeners[event] ||= new Set()).add(cb); return () => listeners[event].delete(cb); }
function emit(event, payload){ (listeners[event] || []).forEach(cb => { try{ cb(payload); }catch(_){} }); }

// ---- storage (localStorage fallback to memory) ----
const mem = { accessToken: null, refreshToken: null, user: null };
const store = {
  get(key){ try { return JSON.parse(localStorage.getItem(key)); } catch { return mem[key] ?? null; } },
  set(key, val){ try { localStorage.setItem(key, JSON.stringify(val)); } catch { mem[key] = val; } },
  del(key){ try { localStorage.removeItem(key); } catch { mem[key] = null; } }
};

const KEYS = {
  access: "auth.accessToken",
  refresh: "auth.refreshToken",
  user: "auth.user"
};

// ---- jwt helpers ----
function parseJwt(token){
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
}
function isExpired(token){
  const p = parseJwt(token);
  if(!p || !p.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return (p.exp - CLOCK_SKEW_SEC) <= now;
}

// ---- token state ----
let refreshingPromise = null;

export function getAccessToken(){ return store.get(KEYS.access); }
export function getRefreshToken(){ return store.get(KEYS.refresh); }
export function getUser(){ return store.get(KEYS.user); }
export function isAuthenticated(){ const t = getAccessToken(); return !!t && !isExpired(t); }

// ---- core calls ----
async function postJson(path, body, opts={}){
  const res = await fetch(AUTH_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(opts.headers||{}) },
    credentials: USE_COOKIE_REFRESH ? "include" : "same-origin",
    body: JSON.stringify(body || {})
  });
  if(!res.ok){
    const text = await res.text().catch(()=> "");
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
  }
  return res.json();
}

function saveSession({ accessToken, refreshToken, user }){
  if(accessToken) store.set(KEYS.access, accessToken);
  if(!USE_COOKIE_REFRESH && refreshToken) store.set(KEYS.refresh, refreshToken);
  if(user !== undefined) store.set(KEYS.user, user);
  emit("change", { authenticated: isAuthenticated(), user: getUser() });
}

function clearSession(){
  store.del(KEYS.access);
  store.del(KEYS.refresh);
  store.del(KEYS.user);
  emit("change", { authenticated: false, user: null });
}

// ---- public API ----
export async function register(payload){
  const data = await postJson("/auth/register", payload);
  // Some backends auto-login on register. If yours does, capture tokens:
  if(data.accessToken) saveSession(data);
  return data;
}

export async function login({ email, password }){
  const data = await postJson("/auth/login", { email, password });
  saveSession(data);
  emit("login", { user: data.user });
  return data.user;
}

export async function refresh(){
  // guard: prevent stampede
  if(refreshingPromise) return refreshingPromise;
  refreshingPromise = (async () => {
    if(USE_COOKIE_REFRESH){
      const data = await postJson("/auth/refresh");
      saveSession(data);
      return data.accessToken;
    } else {
      const r = getRefreshToken();
      if(!r) throw new Error("No refresh token");
      const data = await postJson("/auth/refresh", { refreshToken: r });
      saveSession(data);
      return data.accessToken;
    }
  })().finally(() => { refreshingPromise = null; });
  return refreshingPromise;
}

export async function logout(){
  try {
    if(!USE_COOKIE_REFRESH){
      const r = getRefreshToken();
      if(r) await postJson("/auth/logout", { refreshToken: r });
    } else {
      await postJson("/auth/logout", {}); // server clears httpOnly cookie
    }
  } catch(_){}
  clearSession();
  emit("logout");
}

// ---- fetch with auto token + auto refresh ----
export async function authFetch(input, init = {}){
  let access = getAccessToken();
  // Proactive refresh if token missing/expired
  if(!access || isExpired(access)){
    try { access = await refresh(); } catch { clearSession(); }
  }

  const headers = new Headers(init.headers || {});
  if(access) headers.set("Authorization", `Bearer ${access}`);
  const res = await fetch(input, { ...init, headers, credentials: init.credentials || "same-origin" });

  // If unauthorized, try one reactive refresh
  if(res.status === 401){
    try {
      const newAccess = await refresh();
      const retryHeaders = new Headers(init.headers || {});
      retryHeaders.set("Authorization", `Bearer ${newAccess}`);
      return await fetch(input, { ...init, headers: retryHeaders, credentials: init.credentials || "same-origin" });
    } catch {
      clearSession();
      return res; // bubble original 401
    }
  }
  return res;
}

// ---- convenience: GET/POST helpers ----
export const api = {
  get: (url) => authFetch(url, { method: "GET" }),
  post: (url, body) => authFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  })
};
