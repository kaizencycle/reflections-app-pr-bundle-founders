// login
import { login, onAuth, api, isAuthenticated, getUser } from "./auth";

await login({ email: "you@domain.com", password: "secret" });

// react to changes
onAuth("change", ({ authenticated, user }) => {
  console.log("Auth state:", authenticated, user);
});

// call protected API
const res = await api.get("/api/reflections");

const data = await res.json();  

// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./lib/jwt";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access")?.value || req.headers.get("authorization")?.replace("Bearer ","");
  const payload = token ? await verifyJwt(token).catch(() => null) : null;

  const isFounders = payload?.roles?.includes("founder");
  if (!isFounders) return NextResponse.redirect(new URL("https://app.yourdomain.com/"));
  return NextResponse.next();
}
