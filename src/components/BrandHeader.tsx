import Link from "next/link";
import { BrandAvatar } from "./BrandAvatar";

export function BrandHeader({
  name,
  description,
  avatar,
}: {
  name: string;
  description: string;
  avatar: string;
}) {
  return (
    <div
      className="px-4 sm:px-6 lg:px-24 py-6 sm:py-8"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] mb-3 transition-colors duration-150"
        style={{
          color: "#a0a0a0",
          fontFamily: "var(--font-mono)",
        }}
      >
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
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to designs
      </Link>
      <h1
        className="text-[22px] sm:text-[28px] mb-3 flex items-center gap-3"
        style={{
          fontFamily: "var(--font-mono)",
          color: "#ededed",
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        <BrandAvatar avatar={avatar} name={name} size={32} />
        <span>Design System inspired by {name}</span>
      </h1>
      {description && (
        <p
          className="text-[14px] sm:text-[16px]"
          style={{ color: "#a0a0a0", maxWidth: "65%" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
