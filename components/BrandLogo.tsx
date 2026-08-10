/**
 * Four-point sparkle drawn around (0,0), then translated to the tile center.
 * Avoids the old 24×24 path whose visual mass sat high/left.
 */
const SPARKLE =
  "M0 -9.2 C 0.42 -2.5 2.5 -0.42 9.2 0 C 2.5 0.42 0.42 2.5 0 9.2 C -0.42 2.5 -2.5 0.42 -9.2 0 C -2.5 -0.42 -0.42 -2.5 0 -9.2 Z";

export default function BrandLogo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <rect width="32" height="32" rx="7" fill="var(--brand)" />
      <path
        d={SPARKLE}
        fill="var(--brand-soft)"
        transform="translate(16 16) scale(1.05)"
      />
    </svg>
  );
}
