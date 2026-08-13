/* eslint-disable @next/next/no-img-element */

type CanvaLogoProps = {
  className?: string;
};

/** Official Canva icon — use for surfaces below ~50px (toolbar, footer). */
export function CanvaIcon({ className = "h-5 w-5" }: CanvaLogoProps) {
  return (
    <img
      src="/canva/icon.svg"
      alt=""
      aria-hidden
      className={className}
      draggable={false}
    />
  );
}

/** Official Canva wordmark — use for modals and surfaces above ~50px. */
export function CanvaWordmark({ className = "h-7 w-auto" }: CanvaLogoProps) {
  return (
    <img
      src="/canva/wordmark.svg"
      alt="Canva"
      className={className}
      draggable={false}
    />
  );
}

export function CanvaPoweredBy({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B7280] ${className}`}
    >
      <span>Powered by</span>
      <CanvaWordmark className="h-3 w-auto opacity-90" />
    </p>
  );
}
