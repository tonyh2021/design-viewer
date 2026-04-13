export default function AboutPage() {
  return (
    <section className="px-4 sm:px-6 lg:px-24 py-10 sm:py-14 max-w-3xl">
      <h1
        className="text-[20px] sm:text-[24px] mb-6"
        style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}
      >
        About
      </h1>
      <div
        className="space-y-4 text-[14px] leading-relaxed text-[#a0a0a0]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <p>
          <strong className="text-[#ededed]">Design Viewer</strong> is a browser
          for{" "}
          <a
            href="https://getdesign.md/what-is-design-md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#ededed] transition-colors duration-150"
          >
            DESIGN.md
          </a>{" "}
          — a standard way for brands and products to publish their design
          systems as a single Markdown file.
        </p>
        <p>
          This site aggregates every public DESIGN.md and lets you browse,
          search, and preview them in one place. You can filter by category,
          compare design tokens across brands, and toggle between light and dark
          theme previews.
        </p>
        <h2 className="text-[16px] text-[#ededed] pt-4">How it works</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Brand data is synced from{" "}
            <a
              href="https://getdesign.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#ededed] transition-colors duration-150"
            >
              getdesign.md
            </a>{" "}
            and the{" "}
            <a
              href="https://github.com/VoltAgent/awesome-design-md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#ededed] transition-colors duration-150"
            >
              awesome-design-md
            </a>{" "}
            repository.
          </li>
          <li>
            Each brand page includes a rendered preview of the design system and
            the raw DESIGN.md content.
          </li>
          <li>
            The entire site is statically generated — no backend, no login, just
            fast browsing.
          </li>
        </ul>
        <h2 className="text-[16px] text-[#ededed] pt-4">Open source</h2>
        <p>
          Design Viewer is open source. Contributions and feedback are welcome on{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#ededed] transition-colors duration-150"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </section>
  );
}
