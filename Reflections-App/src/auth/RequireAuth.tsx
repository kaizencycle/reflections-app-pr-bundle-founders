import { Navigate, useLocation } from "react-router-dom";
import { isAuthed } from "../lib/auth";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const authed = isAuthed();
  const loc = useLocation();
  if (!authed) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}
