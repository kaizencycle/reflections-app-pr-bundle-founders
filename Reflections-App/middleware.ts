import { NextRequest, NextResponse } from "next/server";

// Minimal JWT parse (no signature verify here; do full verify server-side)
function parseJwt(token: string) {
  try { return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8")); }
  catch { return null; }
}

export async function middleware(req: NextRequest) {
  const tier = process.env.NEXT_PUBLIC_APP_TIER || "public";
  if (tier !== "founders") return NextResponse.next();

  const cookie = req.cookies.get("access")?.value;
  const authz = req.headers.get("authorization");
  const token = cookie || (authz?.startsWith("Bearer ") ? authz.slice(7) : "");
  const payload = token ? parseJwt(token) : null;

  const isFounders = Array.isArray(payload?.roles) && payload.roles.includes("founder");
  if (!isFounders) {
    const redirectURL = new URL("https://lab4-proof.onrender.com/", req.url);
    return NextResponse.redirect(redirectURL);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
