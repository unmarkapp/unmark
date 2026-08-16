/** Public site URL (www — apex unmark.ink requires separate DNS). */
export const SITE_URL = "https://www.unmark.ink";

export const SITE_NAME = "Unmark";

/** Chrome Web Store listing for Unmark for Gemini. */
export const CHROME_WEB_STORE_URL =
  "https://chrome.google.com/webstore/detail/helligpoigiemhikanpdlnedjehhjhni";

/** Product Hunt product page + featured badge. */
export const PRODUCT_HUNT_URL =
  "https://www.producthunt.com/products/unmark-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-unmark-2";

export const PRODUCT_HUNT_BADGE_SRC =
  "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1222339&theme=dark&t=1786642666647";

/** Hosted Unmark MCP endpoint for Claude Connectors and other remote MCP clients. */
export const MCP_SERVER_URL = "https://mcp.unmark.ink/mcp";

/**
 * Public App Store and Play Store listings.
 * Empty until listings are public — Apps cards and the header Apps link show Soon.
 * https://apps.apple.com/us/app/unmark/id6756499973
 * https://play.google.com/store/apps/details?id=ink.unmark.app
 */
export const IOS_APP_URL = "";
export const ANDROID_APP_URL = "";

/** Primary SERP title — Gemini wedge + suite coverage. */
export const SITE_TITLE_DEFAULT =
  "Unmark — Gemini Watermark Remover, Video & Background Cutout";

export const SITE_TAGLINE =
  "Unmark cleans AI media: remove Gemini sparkles from images and videos, or cut out the subject. Free Instant image cleanup in your browser — Cloud for video, Library, bulk, background removal, and the Chrome extension.";

export const SITE_ONE_LINER =
  "Unmark cleans AI media — remove Gemini sparkles from images and videos, or cut out the subject.";

export const SITE_KEYWORDS = [
  "gemini watermark remover",
  "remove gemini watermark",
  "gemini video watermark remover",
  "remove gemini watermark from video",
  "google flow watermark remover",
  "veo watermark remover",
  "remove veo watermark",
  "remove gemini sparkle",
  "gemini stamp remover",
  "how to remove gemini watermark",
  "google gemini watermark remover",
  "free gemini watermark remover",
  "gemini watermark remover online",
  "nano banana watermark remover",
  "ai watermark remover gemini",
  "clean gemini images",
  "ai background remover",
  "background removal",
  "remove background from image",
  "transparent png cutout",
  "unmark",
];

/** Product pillars for home / tools / directories. */
export const PRODUCT_TOOLS = [
  {
    id: "image",
    title: "Image watermark",
    description:
      "Remove the Gemini sparkle from stills. Instant is free in your browser — no account.",
    href: "/#upload",
    cta: "Try Instant free",
    badge: "Free Instant",
  },
  {
    id: "video",
    title: "Video watermark",
    description:
      "Clean Veo and Google Flow clips with Cloud. Short videos, saved to your Library.",
    href: "/#upload",
    cta: "Upload a video",
    badge: "Cloud",
  },
  {
    id: "background",
    title: "Background remove",
    description:
      "Cut out the subject and download a transparent PNG — portraits, products, and AI stills.",
    href: "/tools/background-removal",
    cta: "Open cutout tool",
    badge: "New",
  },
  {
    id: "create",
    title: "Create with Nano Banana",
    description:
      "Prompt Nano Banana in Unmark. Images without the Gemini sparkle.",
    href: "/tools/create",
    cta: "Coming soon",
    badge: "Coming soon",
    comingSoon: true,
  },
  {
    id: "extension",
    title: "Chrome extension",
    description:
      "Unmark on Gemini and Google Flow while you generate — clean and download.",
    href: "/extension",
    cta: "Get the extension",
    badge: "Chrome",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "How do I remove the Gemini watermark from an image?",
    answer:
      "Drop a Gemini export on Unmark. Instant cleans one image in your browser with no account. Cloud saves the result to your Library, supports bulk, and works with the Chrome extension.",
  },
  {
    question: "How do I remove the Gemini watermark from a video?",
    answer:
      "Sign in and upload your Veo or Google Flow MP4, MOV, or WebM clip. Unmark Cloud finds the sparkle on every frame and saves the clean video to your Library. You can close the tab — we’ll notify you when it’s ready.",
  },
  {
    question: "Can Unmark remove image backgrounds?",
    answer:
      "Yes. Use Background removal under Tools, or cut out a cleaned Library image. You get a transparent PNG cutout for portraits, products, and AI stills. Sign in to use Cloud credits and save results to Library.",
  },
  {
    question: "Does this work with Google Flow and Veo videos?",
    answer:
      "Yes. Unmark removes the visible Gemini and Veo sparkle logo from video exports out of Google Flow, Veo, Gemini, Imagen, and Nano Banana. Use Cloud mode for video; Instant mode is for single images in the browser.",
  },
  {
    question: "What is the Gemini sparkle / stamp on images?",
    answer:
      "Google Gemini adds a small four-point sparkle watermark, usually in a corner of AI-generated images and video frames. Unmark is built specifically to remove that Gemini sparkle — not every generic watermark.",
  },
  {
    question: "Can I remove a Gemini watermark for free?",
    answer:
      "Yes. Instant mode cleans a single image in your browser with no sign-in. New accounts get free Cloud credits to try video cleanup, background removal, Library saves, bulk processing, and the Chrome extension.",
  },
  {
    question: "What's the difference between Instant and Cloud?",
    answer:
      "Instant is free in your browser — download the cleaned image. Cloud saves to Library and unlocks video, background removal, and the Chrome extension.",
  },
  {
    question: "Does Unmark work on Gemini 16:9 and 9:16 exports?",
    answer:
      "Yes. Unmark is built for common Gemini landscape and portrait exports and keeps the original resolution when you download.",
  },
  {
    question: "Is there a Chrome extension for Gemini watermark removal?",
    answer:
      "Yes. Unmark for Gemini works on Gemini and Google Flow — clean as you generate, then download. Sign in on Unmark so results appear in Library. For video and background removal, use the website.",
  },
  {
    question: "Is removing the Gemini watermark legal?",
    answer:
      "Use Unmark on content you created or have rights to use. Google adds the visible sparkle to AI outputs you generate; many creators remove it before publishing client work, ads, or social posts. Follow platform rules and disclose AI content where required.",
  },
  {
    question: "What happens to my video if I refresh the page?",
    answer:
      "With Unmark Cloud, video stays in your Library even if you close the tab. You can also get notified when it’s ready.",
  },
  {
    question: "Can I download a Gemini video without the watermark?",
    answer:
      "Export the original clip from Gemini, Veo, or Google Flow, upload it to Unmark Cloud, and download the cleaned MP4 from your Library when it’s ready.",
  },
  {
    question: "Does Gemini Advanced remove the watermark for me?",
    answer:
      "No. Google does not offer a setting to turn off the visible sparkle on Gemini, Veo, Imagen, or Nano Banana exports. Unmark removes it after you download the file.",
  },
] as const;

export const GUIDE_LINKS = [
  {
    href: "/guides/remove-gemini-watermark",
    title: "Remove Gemini watermark from an image",
    description: "Step-by-step image cleanup for Gemini sparkle exports.",
  },
  {
    href: "/guides/remove-gemini-video-watermark",
    title: "Gemini video watermark remover",
    description: "Clean Veo and Gemini clips frame by frame with Cloud.",
  },
  {
    href: "/guides/google-flow-watermark-remover",
    title: "Google Flow watermark remover",
    description: "Remove the visible mark from Flow and Veo video exports.",
  },
  {
    href: "/guides/remove-veo-watermark",
    title: "Remove Veo watermark",
    description: "Strip the Veo sparkle logo from MP4, MOV, and WebM files.",
  },
  {
    href: "/guides/free-gemini-watermark-remover",
    title: "Free Gemini watermark remover",
    description: "Instant browser cleanup with no sign-in required.",
  },
  {
    href: "/tools/background-removal",
    title: "Background removal",
    description: "Cut out subjects and download transparent PNG cutouts.",
  },
  {
    href: "/guides/mcp-server",
    title: "MCP server for Claude",
    description: "Connect Unmark to Claude and other MCP clients.",
  },
] as const;
