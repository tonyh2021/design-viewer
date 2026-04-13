#!/usr/bin/env node

import { load } from "cheerio";
import { execFile } from "child_process";
import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const DATA_DIR = join(import.meta.dirname, "..", "data");
const BRANDS_DIR = join(DATA_DIR, "brands");
const BRANDS_JSON = join(DATA_DIR, "brands.json");
const GETDESIGN_URL = "https://getdesign.md";
const README_URL =
  "https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/README.md";
const CONCURRENCY = 5;
const FORCE = process.argv.includes("--force");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeHash(name, description, avatar) {
  return createHash("md5")
    .update(`${name}\0${description}\0${avatar}`)
    .digest("hex")
    .slice(0, 12);
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function pMap(items, fn, concurrency) {
  const results = [];
  let i = 0;
  async function next() {
    const idx = i++;
    if (idx >= items.length) return;
    results[idx] = await fn(items[idx], idx);
    await next();
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => next()));
  return results;
}

// ---------------------------------------------------------------------------
// 2.1 + 2.2: Parse getdesign.md homepage for brand metadata
// ---------------------------------------------------------------------------

async function fetchBrandsFromHomepage() {
  console.log("Fetching getdesign.md homepage...");
  const html = await fetchText(GETDESIGN_URL);
  const $ = load(html);

  const brands = [];
  // Each brand row is an <a href="/{slug}/design-md"> with grid layout
  $('a[href$="/design-md"]').each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const match = href.match(/^\/([^/]+)\/design-md$/);
    if (!match) return;

    // Skip duplicates (marquee has duplicate links)
    const slug = match[1];
    if (brands.some((b) => b.slug === slug)) return;

    // Only match grid rows (not marquee items)
    const style = $(el).attr("style") || "";
    if (!style.includes("grid-template-columns")) return;

    const spans = $(el).find("span");
    const pEl = $(el).find("p");

    // Name: from img alt or span[role=img] aria-label
    const img = $(el).find("img");
    const roleImg = $(el).find('span[role="img"]');
    let name = "";
    let avatar = "";

    if (img.length) {
      name = img.attr("alt") || "";
      avatar = img.attr("src") || "";
    } else if (roleImg.length) {
      name = roleImg.attr("aria-label") || "";
      // Raw SVG markup as string
      const svgEl = roleImg.find("svg");
      if (svgEl.length) {
        avatar = $.html(svgEl);
      }
    }

    // Description
    const description = pEl.first().text().trim();

    // Installs and bookmarks (last two spans with text-label-12 and text-right)
    const statSpans = $(el).find("span.text-right");
    const installs = statSpans.eq(0).text().trim() || "—";
    const bookmarks = statSpans.eq(1).text().trim() || "—";

    if (name && slug) {
      // Clean up name (remove emoji spans like ❤️)
      name = name.replace(/\s*❤️\s*/, "").trim();
      brands.push({ slug, name, description, avatar, installs, bookmarks });
    }
  });

  console.log(`  Found ${brands.length} brands from homepage`);
  return brands;
}

// ---------------------------------------------------------------------------
// 2.3: Parse awesome-design-md README for category mapping
// ---------------------------------------------------------------------------

async function fetchCategoryMap() {
  console.log("Fetching awesome-design-md README for categories...");
  const readme = await fetchText(README_URL);

  const categoryMap = {};
  let currentCategory = null;

  for (const line of readme.split("\n")) {
    // Match ### Category Heading
    const headingMatch = line.match(/^### (.+)/);
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      // Skip non-category headings
      if (
        heading === "What is DESIGN.md?" ||
        heading === "How to Use" ||
        heading.startsWith("What's Inside")
      ) {
        currentCategory = null;
        continue;
      }
      currentCategory = heading;
      continue;
    }

    // Match brand entry: - [**Name**](https://getdesign.md/{slug}/design-md)
    if (currentCategory) {
      const brandMatch = line.match(
        /\[.*?\]\(https:\/\/getdesign\.md\/([^/]+)\/design-md\)/
      );
      if (brandMatch) {
        categoryMap[brandMatch[1]] = currentCategory;
      }
    }
  }

  const categoryCount = Object.keys(categoryMap).length;
  console.log(`  Found ${categoryCount} slug-to-category mappings`);
  return categoryMap;
}

// ---------------------------------------------------------------------------
// 2.4: Rewrite getdesign.md nav in preview HTML
// ---------------------------------------------------------------------------

function rewritePreviewNav(html, slug) {
  const $ = load(html);

  $("nav.nav").each((_, el) => {
    const $nav = $(el);
    const text = $nav.text();
    if (!text.includes("getdesign.md") && !text.includes("awesome-design-md")) return;

    // Rewrite brand link text to "Design Viewer", remove href (not navigable in iframe)
    const $brandLink = $nav.find(".nav-brand-link");
    if ($brandLink.length) {
      $brandLink.removeAttr("href");
      $brandLink.removeAttr("target");
      $brandLink.find(".nav-brand").text("Design Viewer");
    } else {
      const $brand = $nav.find("a.nav-brand");
      if ($brand.length) {
        $brand.removeAttr("href");
        $brand.removeAttr("target");
        $brand.text("Design Viewer");
      }
    }

    // Remove GitHub link
    $nav.find(".nav-github").remove();

    // Keep .nav-links and .nav-cta as-is
  });

  // Remove VoltAgent footer
  $("footer").each((_, el) => {
    const text = $(el).text();
    if (text.includes("VoltAgent")) {
      $(el).remove();
    }
  });

  // Inject script to fix anchor links in srcdoc iframes
  // (href="#id" navigates parent instead of scrolling within iframe)
  if (!$("script#__anchor_fix__").length) {
    $("body").append(
      '<script id="__anchor_fix__">document.addEventListener("click",function(e){var a=e.target.closest(\'a[href^="#"]\');if(a){e.preventDefault();var id=a.getAttribute("href").slice(1);var el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth"});}});</script>'
    );
  }

  // Clean up getdesign.md-specific CSS comments but keep the nav styles functional
  $("style").each((_, el) => {
    const css = $(el).html() || "";
    if (css.includes("getdesign.md nav")) {
      const cleaned = css
        .replace(/\/\*\s*getdesign\.md nav[^*]*\*\//g, "/* preview nav */");
      $(el).html(cleaned);
    }
  });

  return $.html();
}

// ---------------------------------------------------------------------------
// 2.5: Fetch HTML files for a single brand
// ---------------------------------------------------------------------------

async function fetchBrandHtml(slug) {
  const brandDir = join(BRANDS_DIR, slug);
  mkdirSync(brandDir, { recursive: true });

  // Fetch preview HTML files
  const previewUrls = {
    "preview.html": `${GETDESIGN_URL}/design-md/${slug}/preview`,
    "preview-dark.html": `${GETDESIGN_URL}/design-md/${slug}/preview-dark`,
  };

  for (const [filename, url] of Object.entries(previewUrls)) {
    try {
      const html = await fetchText(url);
      const content = rewritePreviewNav(html, slug);
      writeFileSync(join(brandDir, filename), content, "utf-8");
    } catch (err) {
      console.warn(`  ⚠ Failed to fetch ${filename} for ${slug}: ${err.message}`);
    }
  }

  // Download raw DESIGN.md via getdesign CLI
  const designMdPath = join(brandDir, "DESIGN.md");
  try {
    await execFileAsync("npx", ["getdesign@latest", "add", slug, "--force", "--out", designMdPath], {
      timeout: 30000,
    });
  } catch (err) {
    console.warn(`  ⚠ Failed to download DESIGN.md for ${slug}: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Main sync
// ---------------------------------------------------------------------------

async function main() {
  console.log(FORCE ? "Running FORCE sync (re-fetching all)..." : "Running incremental sync...");
  console.log();

  // Ensure directories exist
  mkdirSync(BRANDS_DIR, { recursive: true });

  // Fetch data from both sources
  const [freshBrands, categoryMap] = await Promise.all([
    fetchBrandsFromHomepage(),
    fetchCategoryMap(),
  ]);

  if (freshBrands.length === 0) {
    console.error("ERROR: No brands found from homepage. Aborting to preserve cache.");
    process.exit(1);
  }

  // Load existing brands.json
  let existingBrands = [];
  if (existsSync(BRANDS_JSON)) {
    try {
      existingBrands = JSON.parse(readFileSync(BRANDS_JSON, "utf-8"));
    } catch {
      console.warn("  ⚠ Could not parse existing brands.json, starting fresh");
    }
  }
  const existingMap = new Map(existingBrands.map((b) => [b.slug, b]));

  // Determine what needs fetching
  const freshSlugs = new Set(freshBrands.map((b) => b.slug));
  const toFetch = [];
  const toSkip = [];
  const toRemove = [];

  for (const brand of freshBrands) {
    const category = categoryMap[brand.slug] || "Other";
    const hash = computeHash(brand.name, brand.description, brand.avatar);
    const existing = existingMap.get(brand.slug);

    brand.category = category;
    brand._hash = hash;

    if (FORCE || !existing || existing._hash !== hash) {
      toFetch.push(brand);
    } else {
      // Only update metadata fields
      toSkip.push({ ...existing, ...brand, _hash: existing._hash });
    }
  }

  // Find removed brands
  for (const slug of existingMap.keys()) {
    if (!freshSlugs.has(slug)) {
      toRemove.push(slug);
    }
  }

  console.log();
  console.log(`  Brands to fetch HTML: ${toFetch.length}`);
  console.log(`  Brands unchanged:     ${toSkip.length}`);
  console.log(`  Brands to remove:     ${toRemove.length}`);
  console.log();

  // 2.6: Remove deleted brands
  for (const slug of toRemove) {
    const brandDir = join(BRANDS_DIR, slug);
    if (existsSync(brandDir)) {
      rmSync(brandDir, { recursive: true });
      console.log(`  ✗ Removed ${slug}`);
    }
  }

  // 2.5: Fetch HTML for changed/new brands with concurrency control
  if (toFetch.length > 0) {
    console.log(`Fetching HTML for ${toFetch.length} brands (concurrency: ${CONCURRENCY})...`);
    await pMap(
      toFetch,
      async (brand) => {
        try {
          await fetchBrandHtml(brand.slug);
          console.log(`  ✓ ${brand.name}`);
        } catch (err) {
          console.warn(`  ⚠ Error fetching ${brand.slug}: ${err.message}`);
        }
      },
      CONCURRENCY
    );
  }

  // 2.7: Merge and write brands.json
  const finalBrands = [...toSkip, ...toFetch].sort((a, b) =>
    a.slug.localeCompare(b.slug)
  );

  writeFileSync(BRANDS_JSON, JSON.stringify(finalBrands, null, 2), "utf-8");
  console.log();
  console.log(`✓ Wrote ${finalBrands.length} brands to brands.json`);
  console.log("Sync complete!");
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
