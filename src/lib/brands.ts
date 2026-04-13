import { readFileSync } from "fs";
import { join } from "path";

export interface Brand {
  slug: string;
  name: string;
  description: string;
  category: string;
  avatar: string;
  installs: string;
  bookmarks: string;
  _hash: string;
}

const DATA_DIR = join(process.cwd(), "data");

export function getAllBrands(): Brand[] {
  const json = readFileSync(join(DATA_DIR, "brands.json"), "utf-8");
  return JSON.parse(json);
}

export function getBrand(slug: string): Brand | undefined {
  return getAllBrands().find((b) => b.slug === slug);
}

export function getBrandHtml(
  slug: string,
  file: "preview.html" | "preview-dark.html"
): string {
  const filePath = join(DATA_DIR, "brands", slug, file);
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

export function getBrandDesignMd(slug: string): string {
  const filePath = join(DATA_DIR, "brands", slug, "DESIGN.md");
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

export function getCategories(brands: Brand[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const brand of brands) {
    counts.set(brand.category, (counts.get(brand.category) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
