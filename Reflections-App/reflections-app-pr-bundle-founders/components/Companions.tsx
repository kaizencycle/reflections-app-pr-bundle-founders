// components/Companions.tsx
import clsx from "clsx";

type Item = {
  id: string;
  name: string;
  desc: string;
  color: string;
  active?: boolean;
};

const items: Item[] = [
  { id: "jade",   name: "Jade",   desc: "Strategic Advisor",   color: "bg-[#6d5efc]" },
  { id: "hermes", name: "Hermes", desc: "Quick Insights Guide", color: "bg-[#2ecc71]" },
  { id: "eve",    name: "Eve",    desc: "Wellness Guide",       color: "bg-[#ff2e88]" },
  { id: "zeus",   name: "Zeus",   desc: "Action Coach",         color: "bg-[#ff3b30]" }, 
];

export default function Companions() {
  return (
    <div className="p-3 space-y-3">
      {items.map((i) => (
        <button
          key={i.id}
          className={clsx(
            "w-full text-left rounded-xl px-4 py-3 border transition",
            "border-token bg-surface hover:bg-surface-muted",
            "focus:outline-none focus:ring-2 focus:ring-[var(--brand)]",
            i.active && "ring-2 ring-[var(--brand)] shadow-sm"
          )}
        >
          <div className="flex items-center gap-3">
            <span className={clsx("h-3 w-3 rounded-full", i.color)} />
            <div>
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm text-muted">{i.desc}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
