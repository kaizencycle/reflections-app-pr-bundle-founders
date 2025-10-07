import { useState } from "react";
import { setToken } from "../lib/auth";

const API_BASE = (import.meta as any).env?.VITE_API_BASE || (globalThis as any).process?.env?.NEXT_PUBLIC_API_BASE;

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const r = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ user, password }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.detail || "Login failed");
      setToken(j.access_token);
      window.location.href = "/"; // or /dashboard
    } catch (e: any) {
      setErr(e.message || "Login failed");
    }
  }

  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#0b0b10",color:"#d9c587"}}>
      <form onSubmit={onSubmit} style={{width:320,padding:24,border:"1px solid #2a2a33",borderRadius:12,background:"#111116"}}>
        <h1 style={{margin:"0 0 12px"}}>Founder’s PAW</h1>
        <p style={{opacity:.8,margin:"0 0 16px"}}>Admin sign-in</p>
        <label>User</label>
        <input value={user} onChange={e=>setUser(e.target.value)} style={{width:"100%",margin:"6px 0 12px"}} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%",margin:"6px 0 16px"}} />
        {err && <p style={{color:"#ff6b6b"}}>{err}</p>}
        <button type="submit" style={{width:"100%"}}>Enter</button>
      </form>
    </main>
  );
}
