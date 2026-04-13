"use client";

import { useState } from "react";
import type { Brand } from "@/lib/brands";
import { SearchBar } from "./SearchBar";
import { CategorySidebar } from "./CategorySidebar";
import { BrandTable } from "./BrandTable";

export function BrandIndex({
  brands,
  categories,
}: {
  brands: Brand[];
  categories: { name: string; count: number }[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = brands.filter((b) => {
    if (category !== "All" && b.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-10 sm:py-14">
      <div className="mb-6">
        <h2
          className="text-[20px] sm:text-[24px]"
          style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}
        >
          Find Designs
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
        <CategorySidebar
          categories={categories}
          totalCount={brands.length}
          selected={category}
          onSelect={setCategory}
        />
        <div className="flex-1 min-w-0 overflow-x-auto">
          <SearchBar value={search} onChange={setSearch} />
          <BrandTable brands={filtered} />
        </div>
      </div>
    </section>
  );
}
