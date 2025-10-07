// Example only — do not overwrite your existing App.tsx if you already have routes.
// This shows how to protect routes using RequireAuth (React Router).

import { Routes, Route } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";

export default function AppWithAuth() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/" element={<RequireAuth><Dashboard/></RequireAuth>} />
    </Routes>
  );
}
