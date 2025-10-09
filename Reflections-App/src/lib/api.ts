// One client for all services: Lab4 (Reflections), Ledger, Lab6 (Citizen Shield)

import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE; // your Hive API base URL

function getToken() {
  return localStorage.getItem("civic_token"); // or whatever key you’re using
}

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const LAB4 = process.env.REACT_APP_API_BASE_URL;
const LEDGER = process.env.REACT_APP_API_LEDGER_URL;
const LAB6 = process.env.REACT_APP_API_LAB6_URL;

const api = axios.create({
  timeout: 15000,
});

// Example endpoints
export async function getReflections() {
  const res = await api.get(`${LAB4}/reflections`);
  return res.data;
}

export async function postReflection(content) {
  const res = await api.post(`${LAB4}/reflections`, { content });
  return res.data;
}

export async function companionRespond() {
  const res = await api.post(`${LAB4}/companion/respond`);
  return res.data;
}

/* --------- Env (configure in .env.local) --------- */
const LAB4   = import.meta?.env?.VITE_API_LAB4   || process.env.REACT_APP_API_BASE_URL   || "";
const LEDGER = import.meta?.env?.VITE_API_LEDGER || process.env.REACT_APP_API_LEDGER_URL || "";
const LAB6   = import.meta?.env?.VITE_API_LAB6   || process.env.REACT_APP_API_LAB6_URL   || "";

/* --------- Local token helpers --------- */
const TOKEN_KEY = "civic_token";           // session token for user
const ADMIN_KEY = "admin_token";           // optional, for founder console (if you use it)

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(ADMIN_KEY) || null;
}
export function setToken(tok) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, tok);
}
export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/* --------- Axios with auth + tiny retry --------- */
const api = axios.create({ timeout: 15000 });

api.interceptors.request.use((cfg) => {
  const tok = getToken();
  if (tok) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${tok}` };
  return cfg;
});

// simple retry on 401 using refreshToken()
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    const cfg = err?.config || {};
    if (!cfg.__retried && status === 401) {
      cfg.__retried = true;
      const r = await refreshToken();
      if (r?.ok && r?.token) {
        setToken(r.token);
        cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${r.token}` };
        return api.request(cfg);
      }
    }
    throw err;
  }
);

/* =========================================================================
   Lab4 – Reflections & Companion (front-end facing)
   ========================================================================= */

// Flexible signature: saveReflection(text) OR saveReflection(civicId, text, token)
export async function saveReflection(a, b, c) {
  let civicId, content, token;
  if (typeof b === "undefined") {
    // saveReflection(text)
    content = a;
  } else {
    // saveReflection(civicId, text, token)
    civicId = a;
    content = b;
    token = c;
  }

  // TODO: swap to your real Lab4 endpoint when ready:
  // await api.post(`${LAB4}/reflections`, { civic_id: civicId, content }, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  return { ok: true, content }; // stub for now
}

export async function getReflections() {
  // const { data } = await api.get(`${LAB4}/reflections`);
  // return data?.items ?? [];
  return []; // stub until your Lab4 endpoint is live
}

export async function logoutSoft() {
  try {
    // await api.post(`${LAB4}/auth/logout_soft`);
  } finally {
    clearToken();
  }
}

export async function getCompanion() {
  // const { data } = await api.get(`${LAB4}/companions/current`);
  // return data;
  return { name: "Companion" }; // stub
}

export async function companionRespond(inputText = "") {
  // const { data } = await api.post(`${LAB4}/companions/respond`, { text: inputText });
  // return { ok: true, response: data.reply };
  return { ok: true, response: inputText ? `Echo: “${inputText}”` : "How are you feeling today?" };
}

/* Memory helpers if/when you expose them on Lab4 */
export async function memoryAppend(items) {
  // await api.post(`${LAB4}/memory/append`, { items });
  return { ok: true };
}
export async function memorySummarize() {
  // await api.post(`${LAB4}/memory/summarize`);
  return { ok: true };
}

/* =========================================================================
   Ledger – Attest anchors
   ========================================================================= */

export async function anchorReflection(payload) {
  // expected payload example:
  // { event_type: 'reflection', civic_id: '...', lab_source: 'lab4', payload: {...}, signature?: '...' }
  // await api.post(`${LEDGER}/ledger/attest`, payload);
  return { ok: true }; // stub
}

/* =========================================================================
   Lab6 – Citizen Shield (placeholders)
   ========================================================================= */

export async function lab6Enroll(groupId) {
  // await api.post(`${LAB6}/enroll`, { group_id: groupId });
  return { ok: true };
}

export async function zkVerifyReflection(proof) {
  // await api.post(`${LAB6}/zk/verify-reflection`, proof);
  return { ok: true, valid: true };
}

/* =========================================================================
   Token refresh – called by interceptor and optional hook
   ========================================================================= */

export async function refreshToken() {
  try {
    // const { data } = await api.post(`${LAB4}/auth/refresh`);
    // return { ok: true, token: data.token };
    return { ok: true }; // stub until refresh endpoint is ready
  } catch {
    return { ok: false };
  }

/** =========================================================================
 *  Lab4 – Agents SDK endpoints
 *  =======================================================================*/

type AgentReply = { ok: boolean; agent?: string; reply?: string; error?: string };

export async function pingAgents(): Promise<{ status: string; agents: string[] }> {
  const base = LAB4;
  if (!base) return { status: 'error', agents: [] };

  const res = await fetch(`${base}/agents/ping`, { method: 'GET' });
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return { status: 'error', agents: [] };
}

export async function sendAgentMessage(agent: string, prompt: string): Promise<AgentReply> {
  const base = LAB4;
  if (!base) return { ok: false, error: 'LAB4 base URL not set' };

  let res: Response;
  try {
    res = await fetch(`${base}/agents/message/${agent}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ prompt }),
    });
  } catch (e: any) {
    return { ok: false, error: `network_error: ${e?.message || String(e)}` };
  }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const data = (await res.json()) as AgentReply;
    if (!res.ok) return { ok: false, error: data?.error || `HTTP ${res.status}` };
    return data;
  }
  // Non-JSON (HTML/empty) – make it explicit instead of crashing .json()
  const text = await res.text();
  return { ok: false, error: text || `HTTP ${res.status} (non-JSON)` };
}

