"use client";

import { useState } from "react";
import { ControlBar, type Tab, type Theme } from "./ControlBar";
import { PreviewFrame } from "./PreviewFrame";
import { DesignContent } from "./DesignContent";

export function BrandDetail({
  designMd,
  previewHtml,
  previewDarkHtml,
}: {
  designMd: string;
  previewHtml: string;
  previewDarkHtml: string;
}) {
  const [tab, setTab] = useState<Tab>("preview");
  const [theme, setTheme] = useState<Theme>("light");

  const currentPreview = theme === "dark" ? previewDarkHtml : previewHtml;

  return (
    <div>
      <ControlBar
        tab={tab}
        theme={theme}
        onTabChange={setTab}
        onThemeChange={setTheme}
      />
      {tab === "preview" ? (
        <PreviewFrame html={currentPreview} />
      ) : (
        <DesignContent markdown={designMd} />
      )}
    </div>
  );
}
