import {
  PRODUCT_HUNT_BADGE_SRC,
  PRODUCT_HUNT_URL,
} from "@/lib/seo";

/** Featured-on Product Hunt badge (footer / product page — not hero). */
export default function ProductHuntBadge({
  className = "",
}: {
  className?: string;
}) {
  return (
    <a
      href={PRODUCT_HUNT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block transition opacity-90 hover:opacity-100 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Unmark - Remove Gemini & Veo watermarks from images and video | Product Hunt"
        width={250}
        height={54}
        src={PRODUCT_HUNT_BADGE_SRC}
      />
    </a>
  );
}
