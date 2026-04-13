"use client";

import type { Brand } from "@/lib/brands";
import { BrandRow } from "./BrandRow";

export function BrandTable({ brands }: { brands: Brand[] }) {
  return (
    <div>
      {/* Header */}
      <div
        className="grid items-center py-2 pr-2 sm:pr-4"
        style={{
          borderBottom: "1px solid var(--color-border)",
          gridTemplateColumns: "24px 130px 1fr",
          gap: "0 10px",
        }}
      >
        <span className="text-[12px] text-right" style={{ color: "#a0a0a0", fontFamily: "var(--font-mono)" }}>
          #
        </span>
        <span className="text-[12px]" style={{ color: "#a0a0a0", fontFamily: "var(--font-mono)" }}>
          Design Systems
        </span>
        <span />
      </div>

      {/* Rows */}
      <div className="relative">
        <div className="use-case-scroll" style={{ maxHeight: 1088, overflowY: "auto", paddingRight: 8 }}>
          {brands.length === 0 ? (
            <div className="py-12 text-center text-[13px]" style={{ color: "#a0a0a0" }}>
              No matching designs found.
            </div>
          ) : (
            brands.map((brand) => <BrandRow key={brand.slug} brand={brand} />)
          )}
        </div>
      </div>
    </div>
  );
}
