"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";

type Props = { sidebar: React.ReactNode; children: React.ReactNode };

export default function AppLayout({ sidebar, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="h-dvh flex bg-surface text-default">
      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center gap-2 px-3 py-2 border-b border-token bg-surface">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-token"
          aria-controls="companions-drawer"
          aria-expanded={open}
          aria-label="Toggle companions"
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden className="text-default">☰</span>
        </button>
        <span className="font-medium">Reflections</span>
      </header>

      {/* Sidebar / Drawer */}
      <aside
        id="companions-drawer"
        role="complementary"
        className={clsx(
          "z-50 md:z-auto md:static md:translate-x-0",
          "h-full bg-surface border-r border-token",
          // widths via tokens
          "md:[width:var(--sidebar-w)] [width:var(--sidebar-w-sm)] [max-width:var(--sidebar-w-max)]",
          // off-canvas motion
          "fixed top-0 left-0 transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "md:relative md:flex-shrink-0"
        )}
      >
        {/* Drawer header (mobile only) */}
        <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-token">
          <span className="font-medium">Companions</span>
          <button
            className="h-9 w-9 grid place-items-center rounded-md border border-token"
            aria-label="Close companions"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* scroll area uses token topbar height */}
        <div className="[height:calc(100dvh-var(--topbar-h))] md:h-full overflow-y-auto">
          {sidebar}
        </div>
      </aside>

      {/* Backdrop */}
      {open && (
        <button
          aria-label="Close companions"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/30"
        />
      )}

      {/* Main chat */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 border-b border-token bg-surface">
          <h1 className="text-lg font-medium">Chat</h1>
        </div>
        <div className="flex-1 min-h-0 bg-surface-muted">{children}</div>
      </main>
    </div>
  );
}"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";

type Props = { sidebar: React.ReactNode; children: React.ReactNode };

export default function AppLayout({ sidebar, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="h-dvh flex bg-surface text-default">
      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center gap-2 px-3 py-2 border-b border-token bg-surface">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-token"
          aria-controls="companions-drawer"
          aria-expanded={open}
          aria-label="Toggle companions"
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden className="text-default">☰</span>
        </button>
        <span className="font-medium">Reflections</span>
      </header>

      {/* Sidebar / Drawer */}
      <aside
        id="companions-drawer"
        role="complementary"
        className={clsx(
          "z-50 md:z-auto md:static md:translate-x-0",
          "h-full bg-surface border-r border-token",
          // widths via tokens
          "md:[width:var(--sidebar-w)] [width:var(--sidebar-w-sm)] [max-width:var(--sidebar-w-max)]",
          // off-canvas motion
          "fixed top-0 left-0 transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "md:relative md:flex-shrink-0"
        )}
      >
        {/* Drawer header (mobile only) */}
        <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-token">
          <span className="font-medium">Companions</span>
          <button
            className="h-9 w-9 grid place-items-center rounded-md border border-token"
            aria-label="Close companions"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* scroll area uses token topbar height */}
        <div className="[height:calc(100dvh-var(--topbar-h))] md:h-full overflow-y-auto">
          {sidebar}
        </div>
      </aside>

      {/* Backdrop */}
      {open && (
        <button
          aria-label="Close companions"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/30"
        />
      )}

      {/* Main chat */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 border-b border-token bg-surface">
          <h1 className="text-lg font-medium">Chat</h1>
        </div>
        <div className="flex-1 min-h-0 bg-surface-muted">{children}</div>
      </main>
    </div>
  );
}"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";

type Props = { sidebar: React.ReactNode; children: React.ReactNode };

export default function AppLayout({ sidebar, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="h-dvh flex bg-surface text-default">
      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center gap-2 px-3 py-2 border-b border-token bg-surface">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-token"
          aria-controls="companions-drawer"
          aria-expanded={open}
          aria-label="Toggle companions"
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden className="text-default">☰</span>
        </button>
        <span className="font-medium">Reflections</span>
      </header>

      {/* Sidebar / Drawer */}
      <aside
        id="companions-drawer"
        role="complementary"
        className={clsx(
          "z-50 md:z-auto md:static md:translate-x-0",
          "h-full bg-surface border-r border-token",
          // widths via tokens
          "md:[width:var(--sidebar-w)] [width:var(--sidebar-w-sm)] [max-width:var(--sidebar-w-max)]",
          // off-canvas motion
          "fixed top-0 left-0 transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "md:relative md:flex-shrink-0"
        )}
      >
        {/* Drawer header (mobile only) */}
        <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-token">
          <span className="font-medium">Companions</span>
          <button
            className="h-9 w-9 grid place-items-center rounded-md border border-token"
            aria-label="Close companions"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* scroll area uses token topbar height */}
        <div className="[height:calc(100dvh-var(--topbar-h))] md:h-full overflow-y-auto">
          {sidebar}
        </div>
      </aside>

      {/* Backdrop */}
      {open && (
        <button
          aria-label="Close companions"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/30"
        />
      )}

      {/* Main chat */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 border-b border-token bg-surface">
          <h1 className="text-lg font-medium">Chat</h1>
        </div>
        <div className="flex-1 min-h-0 bg-surface-muted">{children}</div>
      </main>
    </div>
  );
}"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";

type Props = { sidebar: React.ReactNode; children: React.ReactNode };

export default function AppLayout({ sidebar, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="h-dvh flex bg-surface text-default">
      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center gap-2 px-3 py-2 border-b border-token bg-surface">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-token"
          aria-controls="companions-drawer"
          aria-expanded={open}
          aria-label="Toggle companions"
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden className="text-default">☰</span>
        </button>
        <span className="font-medium">Reflections</span>
      </header>

      {/* Sidebar / Drawer */}
      <aside
        id="companions-drawer"
        role="complementary"
        className={clsx(
          "z-50 md:z-auto md:static md:translate-x-0",
          "h-full bg-surface border-r border-token",
          // widths via tokens
          "md:[width:var(--sidebar-w)] [width:var(--sidebar-w-sm)] [max-width:var(--sidebar-w-max)]",
          // off-canvas motion
          "fixed top-0 left-0 transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "md:relative md:flex-shrink-0"
        )}
      >
        {/* Drawer header (mobile only) */}
        <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-token">
          <span className="font-medium">Companions</span>
          <button
            className="h-9 w-9 grid place-items-center rounded-md border border-token"
            aria-label="Close companions"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* scroll area uses token topbar height */}
        <div className="[height:calc(100dvh-var(--topbar-h))] md:h-full overflow-y-auto">
          {sidebar}
        </div>
      </aside>

      {/* Backdrop */}
      {open && (
        <button
          aria-label="Close companions"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/30"
        />
      )}

      {/* Main chat */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 border-b border-token bg-surface">
          <h1 className="text-lg font-medium">Chat</h1>
        </div>
        <div className="flex-1 min-h-0 bg-surface-muted">{children}</div>
      </main>
    </div>
  );
}"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";

type Props = { sidebar: React.ReactNode; children: React.ReactNode };

export default function AppLayout({ sidebar, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="h-dvh flex bg-surface text-default">
      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center gap-2 px-3 py-2 border-b border-token bg-surface">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-token"
          aria-controls="companions-drawer"
          aria-expanded={open}
          aria-label="Toggle companions"
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden className="text-default">☰</span>
        </button>
        <span className="font-medium">Reflections</span>
      </header>

      {/* Sidebar / Drawer */}
      <aside
        id="companions-drawer"
        role="complementary"
        className={clsx(
          "z-50 md:z-auto md:static md:translate-x-0",
          "h-full bg-surface border-r border-token",
          // widths via tokens
          "md:[width:var(--sidebar-w)] [width:var(--sidebar-w-sm)] [max-width:var(--sidebar-w-max)]",
          // off-canvas motion
          "fixed top-0 left-0 transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "md:relative md:flex-shrink-0"
        )}
      >
        {/* Drawer header (mobile only) */}
        <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-token">
          <span className="font-medium">Companions</span>
          <button
            className="h-9 w-9 grid place-items-center rounded-md border border-token"
            aria-label="Close companions"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* scroll area uses token topbar height */}
        <div className="[height:calc(100dvh-var(--topbar-h))] md:h-full overflow-y-auto">
          {sidebar}
        </div>
      </aside>

      {/* Backdrop */}
      {open && (
        <button
          aria-label="Close companions"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/30"
        />
      )}

      {/* Main chat */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 border-b border-token bg-surface">
          <h1 className="text-lg font-medium">Chat</h1>
        </div>
        <div className="flex-1 min-h-0 bg-surface-muted">{children}</div>
      </main>
    </div>
  );
}"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";

type Props = { sidebar: React.ReactNode; children: React.ReactNode };

export default function AppLayout({ sidebar, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="h-dvh flex bg-surface text-default">
      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center gap-2 px-3 py-2 border-b border-token bg-surface">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-token"
          aria-controls="companions-drawer"
          aria-expanded={open}
          aria-label="Toggle companions"
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden className="text-default">☰</span>
        </button>
        <span className="font-medium">Reflections</span>
      </header>

      {/* Sidebar / Drawer */}
      <aside
        id="companions-drawer"
        role="complementary"
        className={clsx(
          "z-50 md:z-auto md:static md:translate-x-0",
          "h-full bg-surface border-r border-token",
          // widths via tokens
          "md:[width:var(--sidebar-w)] [width:var(--sidebar-w-sm)] [max-width:var(--sidebar-w-max)]",
          // off-canvas motion
          "fixed top-0 left-0 transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "md:relative md:flex-shrink-0"
        )}
      >
        {/* Drawer header (mobile only) */}
        <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-token">
          <span className="font-medium">Companions</span>
          <button
            className="h-9 w-9 grid place-items-center rounded-md border border-token"
            aria-label="Close companions"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* scroll area uses token topbar height */}
        <div className="[height:calc(100dvh-var(--topbar-h))] md:h-full overflow-y-auto">
          {sidebar}
        </div>
      </aside>

      {/* Backdrop */}
      {open && (
        <button
          aria-label="Close companions"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/30"
        />
      )}

      {/* Main chat */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 border-b border-token bg-surface">
          <h1 className="text-lg font-medium">Chat</h1>
        </div>
        <div className="flex-1 min-h-0 bg-surface-muted">{children}</div>
      </main>
    </div>
  );
}
