/** Unmark brand marks — four-point sparkle motif from the brand sheet. */

export const BRAND = {
  ink: "#1C1A17",
  copper: "#C5401F",
  peach: "#F0C98A",
  cream: "#FDFBF7",
  sand: "#F0EBE2",
  red: "#C5401F",
  blue: "#4F5B66",
  yellow: "#F0C98A",
} as const;

/** Classic 4-point sparkle path centered on (0, 0). */
export const SPARKLE_PATH =
  "M0 -9.2 L 2.1 -2.1 L 9.2 0 L 2.1 2.1 L 0 9.2 L -2.1 2.1 L -9.2 0 L -2.1 -2.1 Z";

/** Legacy 24×24 sparkle (center at 12,12) — prefer SPARKLE_PATH + translate. */
export const SPARKLE_PATH_24 =
  "M12 2.2c.35 3.6 2.2 5.45 5.8 5.8-3.6.35-5.45 2.2-5.8 5.8-.35-3.6-2.2-5.45-5.8-5.8 3.6-.35 5.45-2.2 5.8-5.8z";

export type LogoTheme = "knockout" | "fade" | "corner" | "eraser";

export const LOGO_THEMES: {
  id: LogoTheme;
  name: string;
  blurb: string;
}[] = [
  {
    id: "knockout",
    name: "Knockout",
    blurb: "Primary mark — red tile, white sparkle cutout.",
  },
  {
    id: "fade",
    name: "Fade out",
    blurb: "Motion of the sparkle disappearing left to right.",
  },
  {
    id: "corner",
    name: "Corner target",
    blurb: "Detection frame — sparkle locked in the corner.",
  },
  {
    id: "eraser",
    name: "Eraser",
    blurb: "Removal in action — sparkle wiped to dust.",
  },
];

function Sparkle({
  fill,
  opacity = 1,
  transform,
}: {
  fill: string;
  opacity?: number;
  transform?: string;
}) {
  return (
    <path
      d={SPARKLE_PATH}
      fill={fill}
      opacity={opacity}
      transform={transform}
    />
  );
}

export function LogoKnockout({
  size = 64,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
    >
      <rect width="64" height="64" fill={BRAND.red} />
      <path
        d={SPARKLE_PATH}
        fill="#FFFFFF"
        transform="translate(32 32) scale(2.1)"
      />
    </svg>
  );
}

export function LogoFadeOut({
  size = 64,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const fills = [BRAND.ink, BRAND.blue, BRAND.red, BRAND.yellow];
  const opacities = [1, 0.85, 0.65, 0.4];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 48"
      className={className}
      aria-hidden
    >
      {fills.map((fill, i) => (
        <g
          key={fill}
          transform={`translate(${16 + i * 28} 24) scale(1.15)`}
        >
          <Sparkle fill={fill} opacity={opacities[i]} />
        </g>
      ))}
    </svg>
  );
}

export function LogoCornerTarget({
  size = 64,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
    >
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="8"
        fill="none"
        stroke={BRAND.ink}
        strokeWidth="2"
      />
      <circle
        cx="46"
        cy="18"
        r="11"
        fill="none"
        stroke={BRAND.ink}
        strokeWidth="1.5"
        strokeDasharray="2.5 2.5"
      />
      <g transform="translate(46 18) scale(0.72)">
        <Sparkle fill={BRAND.peach} />
      </g>
    </svg>
  );
}

export function LogoEraser({
  size = 64,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
    >
      <g transform="translate(20 28) scale(1.35)">
        <Sparkle fill={BRAND.ink} />
      </g>
      {/* eraser body */}
      <rect
        x="30"
        y="18"
        width="26"
        height="14"
        rx="2"
        fill={BRAND.copper}
        transform="rotate(28 43 25)"
      />
      <rect
        x="30"
        y="18"
        width="8"
        height="14"
        rx="1.5"
        fill={BRAND.peach}
        transform="rotate(28 43 25)"
      />
      {/* dust */}
      <circle cx="18" cy="48" r="1.6" fill={BRAND.peach} opacity="0.85" />
      <circle cx="24" cy="52" r="1.2" fill={BRAND.copper} opacity="0.7" />
      <circle cx="14" cy="52" r="1" fill={BRAND.peach} opacity="0.6" />
      <circle cx="28" cy="48" r="0.9" fill={BRAND.ink} opacity="0.35" />
    </svg>
  );
}

export function LogoByTheme({
  theme,
  size = 64,
  className = "",
}: {
  theme: LogoTheme;
  size?: number;
  className?: string;
}) {
  switch (theme) {
    case "fade":
      return <LogoFadeOut size={size} className={className} />;
    case "corner":
      return <LogoCornerTarget size={size} className={className} />;
    case "eraser":
      return <LogoEraser size={size} className={className} />;
    case "knockout":
    default:
      return <LogoKnockout size={size} className={className} />;
  }
}

export function BrandWordmark({
  className = "",
  showTagline = true,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoKnockout size={44} />
      <div className="min-w-0 text-left">
        <div className="font-display text-2xl font-semibold tracking-tight text-[var(--ink)]">
          Unmark
        </div>
        {showTagline ? (
          <div className="text-xs font-medium tracking-wide text-[var(--muted)]">
            Clean file, original quality
          </div>
        ) : null}
      </div>
    </div>
  );
}
