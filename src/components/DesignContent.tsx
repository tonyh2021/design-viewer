"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function DesignContent({ markdown }: { markdown: string }) {
  return (
    <div
      className="px-4 sm:px-8 py-8 mx-auto prose prose-invert prose-lg max-w-4xl use-case-scroll"
      style={{
        overflowY: "auto",
        height: "calc(100vh - 120px)",
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
