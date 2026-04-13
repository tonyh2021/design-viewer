"use client";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="flex items-center gap-2 sm:gap-4 pr-2 sm:pr-4"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <form className="flex items-center flex-1 min-w-0" onSubmit={(e) => e.preventDefault()}>
        <div className="px-3 flex-shrink-0" style={{ color: "var(--color-gray-600)" }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          autoComplete="off"
          placeholder="Search all designs"
          className="flex-1 py-3 text-[13px] outline-none bg-transparent placeholder:text-[#a0a0a0]"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ color: "var(--color-gray-1000)", fontFamily: "var(--font-mono)" }}
        />
      </form>
    </div>
  );
}
