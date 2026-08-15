const SPARKLE =
  "M0 -9.2 L 2.1 -2.1 L 9.2 0 L 2.1 2.1 L 0 9.2 L -2.1 2.1 L -9.2 0 L -2.1 -2.1 Z";

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
      <rect width="32" height="32" fill="var(--brand)" />
      <path
        d={SPARKLE}
        fill="#ffffff"
        transform="translate(16 16) scale(1.05)"
      />
    </svg>
  );
}
