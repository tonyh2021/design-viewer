"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type EditorMode = "read" | "edit";

type Theme = "light" | "dark";

/** Extract all hex color values from DESIGN.md text */
function extractColors(md: string): Map<string, string> {
  const colors = new Map<string, string>();
  // Match patterns like (`#0071e3`) or (`#fff`)
  const re = /`(#[0-9a-fA-F]{3,8})`/g;
  let m;
  while ((m = re.exec(md)) !== null) {
    colors.set(m[1].toLowerCase(), m[1]);
  }
  return colors;
}

/** Replace CSS variable values in preview HTML based on color diffs */
function applyColorDiff(
  html: string,
  originalColors: Map<string, string>,
  editedColors: Map<string, string>
): string {
  let result = html;
  for (const [originalHex] of originalColors) {
    // Find if the same position in edited has a different value
    const editedHex = editedColors.get(originalHex);
    if (editedHex && editedHex !== originalHex) {
      // This color wasn't changed (same key = same value)
      continue;
    }
  }

  // Build old→new mapping by comparing ordered arrays
  const origArr = [...originalColors.keys()];
  const editArr = [...editedColors.keys()];
  const len = Math.min(origArr.length, editArr.length);

  for (let i = 0; i < len; i++) {
    if (origArr[i] !== editArr[i]) {
      // Replace in CSS variable declarations: find the old hex and replace with new
      result = result.replaceAll(origArr[i], editArr[i]);
      // Also handle uppercase variants
      result = result.replaceAll(origArr[i].toUpperCase(), editArr[i]);
    }
  }

  return result;
}

export function BrandDetail({
  designMd,
  previewHtml,
  previewDarkHtml,
}: {
  designMd: string;
  previewHtml: string;
  previewDarkHtml: string;
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mode, setMode] = useState<EditorMode>("read");
  const [editedMd, setEditedMd] = useState(designMd);
  const [copied, setCopied] = useState(false);

  const originalColors = extractColors(designMd);
  const baseHtml = theme === "dark" ? previewDarkHtml : previewHtml;

  const currentPreview = useCallback(() => {
    const editedColors = extractColors(editedMd);
    let html = applyColorDiff(baseHtml, originalColors, editedColors);
    // Ensure anchor links scroll within iframe, not parent
    // srcdoc iframes have URL "about:srcdoc", so href="#id" navigates the parent.
    // Inject a script to intercept anchor clicks and use scrollIntoView instead.
    if (!html.includes("__anchor_fix__")) {
      const anchorScript = `<script id="__anchor_fix__">document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(a){e.preventDefault();var id=a.getAttribute('href').slice(1);var el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth'});}});<\/script>`;
      html = html.replace("</body>", anchorScript + "</body>");
    }
    return html;
  }, [editedMd, baseHtml, originalColors]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setEditedMd(designMd);
  };

  const isModified = editedMd !== designMd;

  return (
    <div
      className="flex flex-col lg:flex-row px-4 sm:px-6 lg:px-12"
      style={{ height: "calc(100vh - 200px)" }}
    >
      {/* Left: DESIGN.md editor */}
      <div
        className="flex flex-col lg:w-[35%] min-w-0"
        style={{ borderRight: "1px solid var(--color-border)" }}
      >
        {/* Editor toolbar */}
        <div
          className="flex items-center justify-between px-4 py-2 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-[12px]"
              style={{ color: "#a0a0a0", fontFamily: "var(--font-mono)" }}
            >
              DESIGN.md
            </span>
            {isModified && (
              <span
                className="text-[11px]"
                style={{ color: "#f59e0b", fontFamily: "var(--font-mono)" }}
              >
                (modified)
              </span>
            )}
            <div
              className="flex rounded-md overflow-hidden ml-2"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <SegmentButton
                label="Read"
                active={mode === "read"}
                onClick={() => setMode("read")}
              />
              <SegmentButton
                label="Edit"
                active={mode === "edit"}
                onClick={() => setMode("edit")}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isModified && (
              <button
                type="button"
                onClick={handleReset}
                className="px-2 py-1 text-[11px] rounded transition-colors duration-100"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "#a0a0a0",
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="px-2 py-1 text-[11px] rounded transition-colors duration-100"
              style={{
                fontFamily: "var(--font-mono)",
                color: copied ? "#22c55e" : "#a0a0a0",
                background: "transparent",
                border: "1px solid var(--color-border)",
                cursor: "pointer",
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        {/* Content: Read or Edit */}
        {mode === "edit" ? (
          <textarea
            value={editedMd}
            onChange={(e) => setEditedMd(e.target.value)}
            className="flex-1 w-full resize-none p-4 use-case-scroll"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#ededed",
              background: "transparent",
              border: "none",
              outline: "none",
              tabSize: 2,
            }}
            spellCheck={false}
          />
        ) : (
          <div
            className="flex-1 p-4 sm:p-6 prose prose-invert prose-sm max-w-none use-case-scroll"
            style={{ overflowY: "auto" }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {editedMd}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Right: Preview */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Preview toolbar */}
        <div
          className="flex items-center justify-between px-4 py-2 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <span
            className="text-[12px]"
            style={{ color: "#a0a0a0", fontFamily: "var(--font-mono)" }}
          >
            Preview
          </span>
          <div
            className="flex rounded-md overflow-hidden"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <SegmentButton
              label="Light"
              active={theme === "light"}
              onClick={() => setTheme("light")}
            />
            <SegmentButton
              label="Dark"
              active={theme === "dark"}
              onClick={() => setTheme("dark")}
            />
          </div>
        </div>
        {/* iframe */}
        <iframe
          srcDoc={currentPreview()}
          className="flex-1 w-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Preview"
        />
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
