// components/Layout.tsx
"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function Layout({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Close drawer on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="h-dvh flex">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center gap-2 px-3 py-2 border-b bg-white">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border"
          aria-controls="mobile-sidebar"
          aria-expanded={open}
          aria-label="Toggle companions"
          onClick={() => setOpen(!open)}
        >
          {/* hamburger */}
          <span aria-hidden className="i-[≡]">≡</span>
        </button>
        <span className="font-medium">Reflections</span>
      </header>

      {/* Sidebar (desktop = static; mobile = drawer) */}
      <aside
        id="mobile-sidebar"
        className={clsx(
          // base
          "z-50 md:z-auto md:static md:translate-x-0 md:w-[320px] w-[85vw] max-w-[360px] h-full bg-white border-r",
          // off-canvas behavior
          "fixed top-0 left-0 transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          // desktop layout
          "md:relative md:flex-shrink-0"
        )}
        role="complementary"
      >
        {/* Close button visible only on mobile drawer */}
        <div className="md:hidden flex items-center justify-between p-3 border-b">
          <span className="font-medium">Companions</span>
          <button
            className="h-9 w-9 grid place-items-center rounded-md border"
            aria-label="Close companions"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100dvh-56px)] md:h-full">
          {sidebar}
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {open && (
        <button
          className="md:hidden fixed inset-0 z-40 bg-black/30"
          aria-label="Close"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main chat area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Optional desktop header */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 border-b">
          <button
            className="md:hidden h-9 w-9 rounded-md border"
            aria-label="Toggle companions"
            onClick={() => setOpen(!open)}
          />
          <h1 className="text-lg font-medium">Chat</h1>
        </div>
        <div className="flex-1 min-h-0">{children}</div>
      </main>
    </div>
  );
}
