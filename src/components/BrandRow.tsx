import Link from "next/link";
import type { Brand } from "@/lib/brands";
import { BrandAvatar } from "./BrandAvatar";

export function BrandRow({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/${brand.slug}`}
      className="group/row grid items-center py-2.5 pr-2 sm:pr-4 transition-colors duration-100 hover:bg-white/[0.04]"
      style={{
        borderBottom: "1px solid var(--color-border)",
        gridTemplateColumns: "24px 130px 1fr",
        gap: "0 10px",
      }}
    >
      <span className="flex items-center justify-center">
        <BrandAvatar avatar={brand.avatar} name={brand.name} />
      </span>
      <span
        className="text-[13px] sm:text-[14px] font-semibold truncate"
        style={{ color: "var(--color-gray-1000)", fontFamily: "var(--font-mono)" }}
      >
        {brand.name}
      </span>
      <p className="text-[12px] sm:text-[13px] truncate min-w-0" style={{ color: "#a0a0a0" }}>
        {brand.description}
      </p>
    </Link>
  );
}
