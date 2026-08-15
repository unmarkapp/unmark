import Link from "next/link";

const FORMATS = [
  { kind: "Image", items: ["PNG", "JPG", "WebP", "JPEG"] },
  { kind: "Video", items: ["MP4", "MOV", "WebM", "M4V"] },
] as const;

const PRODUCTS = [
  "Gemini",
  "Veo",
  "Google Flow",
  "Imagen",
  "Nano Banana",
  "AI Studio",
] as const;

export default function LandingSeoContent() {
  return (
    <section
      id="formats"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Image, video &amp; background tools
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          Unmark removes the visible four-point sparkle Google adds to AI images
          and video, and can cut out subjects for transparent PNGs. Instant mode
          is a free{" "}
          <strong className="font-semibold text-foreground">
            Gemini watermark remover online
          </strong>{" "}
          for stills; Cloud handles Veo clips, Library saves, bulk jobs, and{" "}
          <Link
            href="/tools/background-removal"
            className="font-medium text-brand underline-offset-2 hover:underline"
          >
            background removal
          </Link>
          .
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">
        {FORMATS.map((group) => (
          <div
            key={group.kind}
            className="rounded-[2px] border-2 border-ink bg-surface/90 px-5 py-6"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wide text-brand">
              {group.kind} formats
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((fmt) => (
                <li
                  key={fmt}
                  className="rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-strong"
                >
                  {fmt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl text-center">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Works with Google AI exports
        </h3>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {PRODUCTS.map((name) => (
            <li
              key={name}
              className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-foreground"
            >
              {name}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm leading-relaxed text-muted">
          Need step-by-step help? Read our{" "}
          <Link
            href="/guides/remove-gemini-video-watermark"
            className="font-medium text-brand underline-offset-2 hover:underline"
          >
            video
          </Link>
          ,{" "}
          <Link
            href="/guides/google-flow-watermark-remover"
            className="font-medium text-brand underline-offset-2 hover:underline"
          >
            Google Flow
          </Link>
          , and{" "}
          <Link
            href="/guides/free-gemini-watermark-remover"
            className="font-medium text-brand underline-offset-2 hover:underline"
          >
            free remover
          </Link>{" "}
          guides — or open{" "}
          <Link
            href="/tools"
            className="font-medium text-brand underline-offset-2 hover:underline"
          >
            Tools
          </Link>{" "}
          for cutouts.
        </p>
      </div>
    </section>
  );
}
