export function PreviewFrame({ html }: { html: string }) {
  return (
    <div className="px-4 sm:px-6 lg:px-24">
      <iframe
        srcDoc={html}
        className="w-full border-0"
        style={{ height: "calc(100vh - 120px)" }}
        sandbox="allow-scripts allow-same-origin"
        title="Preview"
      />
    </div>
  );
}
