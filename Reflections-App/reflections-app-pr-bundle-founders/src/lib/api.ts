import { getToken } from "./auth";
const API_BASE = (import.meta as any).env?.VITE_API_BASE || (globalThis as any).process?.env?.NEXT_PUBLIC_API_BASE;

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers, credentials: "omit" });
  const text = await res.text();
  if (!res.ok) throw new Error(text || `${res.status} ${res.statusText}`);
  try { return JSON.parse(text); } catch { return text as any; }
}
