"use client";

export type Tab = "preview" | "designmd";
export type Theme = "light" | "dark";

export function ControlBar({
  tab,
  theme,
  onTabChange,
  onThemeChange,
}: {
  tab: Tab;
  theme: Theme;
  onTabChange: (t: Tab) => void;
  onThemeChange: (t: Theme) => void;
}) {
  const themeDisabled = tab === "designmd";

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-24 py-3 flex-wrap"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <div />

      {/* Tab switcher + theme toggle */}
      <div className="flex items-center gap-3">
        {/* Tab switcher */}
        <div
          className="flex rounded-md overflow-hidden"
          style={{ border: "1px solid var(--color-border)" }}
        >
          <SegmentButton
            label="Preview"
            active={tab === "preview"}
            onClick={() => onTabChange("preview")}
          />
          <SegmentButton
            label="DESIGN.md"
            active={tab === "designmd"}
            onClick={() => onTabChange("designmd")}
          />
        </div>

        {/* Theme toggle */}
        <div
          className="flex rounded-md overflow-hidden"
          style={{
            border: "1px solid var(--color-border)",
            opacity: themeDisabled ? 0.4 : 1,
            pointerEvents: themeDisabled ? "none" : "auto",
          }}
        >
          <SegmentButton
            label="Light"
            active={theme === "light"}
            onClick={() => onThemeChange("light")}
          />
          <SegmentButton
            label="Dark"
            active={theme === "dark"}
            onClick={() => onThemeChange("dark")}
          />
        </div>
      </div>
    </div>
  );
}

function SegmentButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 text-[12px] transition-colors duration-100"
      style={{
        fontFamily: "var(--font-mono)",
        background: active ? "rgba(255,255,255,0.1)" : "transparent",
        color: active ? "var(--color-gray-1000)" : "#a0a0a0",
        cursor: "pointer",
        border: "none",
      }}
    >
      {label}
    </button>
  );
}
