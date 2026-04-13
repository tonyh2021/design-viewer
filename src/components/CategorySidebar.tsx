"use client";

import { useState } from "react";

export function CategorySidebar({
  categories,
  totalCount,
  selected,
  onSelect,
}: {
  categories: { name: string; count: number }[];
  totalCount: number;
  selected: string;
  onSelect: (category: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      {/* Mobile toggle */}
      <button
        type="button"
        className="lg:hidden w-full flex items-center justify-between py-2.5"
        style={{ borderBottom: "1px solid var(--color-border)" }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span
          className="text-[14px]"
          style={{ color: "var(--color-gray-1000)", fontFamily: "var(--font-mono)" }}
        >
          {selected === "All" ? "All" : selected}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200"
          style={{
            color: "var(--color-gray-600)",
            transform: mobileOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Category list */}
      <nav
        className={`lg:flex lg:flex-col gap-0.5 overflow-hidden transition-all duration-200 ${
          mobileOpen ? "flex flex-col" : "hidden lg:flex"
        }`}
      >
        <CategoryButton
          name="All"
          count={totalCount}
          active={selected === "All"}
          onClick={() => { onSelect("All"); setMobileOpen(false); }}
        />
        {categories.map((cat) => (
          <CategoryButton
            key={cat.name}
            name={cat.name}
            count={cat.count}
            active={selected === cat.name}
            onClick={() => { onSelect(cat.name); setMobileOpen(false); }}
          />
        ))}
      </nav>
    </div>
  );
}

function CategoryButton({
  name,
  count,
  active,
  onClick,
}: {
  name: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-2.5 py-2 transition-colors duration-150 px-1 lg:px-0"
      style={{
        width: "100%",
        textAlign: "left",
        background: "none",
        border: "none",
        borderBottom: active ? "1px solid var(--color-gray-1000)" : "none",
        cursor: "pointer",
        color: active ? "var(--color-gray-1000)" : "#a0a0a0",
      }}
      onClick={onClick}
    >
      <span
        className={`flex-1 text-[14px] ${active ? "font-medium" : ""}`}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {name}
      </span>
      <span className="text-[12px]" style={{ color: "#a0a0a0", fontFamily: "var(--font-mono)" }}>
        {count}
      </span>
    </button>
  );
}
