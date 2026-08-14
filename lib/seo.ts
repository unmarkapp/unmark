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
 * Public iOS link when available (TestFlight or App Store).
 * Leave empty until a real URL exists — do not ship a dead link.
 */
export const IOS_APP_URL = "";

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
      "Prompt Gemini, then Unmark removes the sparkle. Live on iOS — web coming soon.",
    href: "/tools/create",
    cta: "Coming soon",
    badge: "Coming soon",
    comingSoon: true,
  },
  {
    id: "extension",
    title: "Chrome extension",
    description:
      "Unmark on Gemini and Google Flow while you generate — queue, clean, download.",
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
      "Sign in and upload your Veo or Google Flow MP4, MOV, or WebM clip. Unmark Cloud detects the sparkle on every frame, processes on our servers, and saves the clean video to your Library. You can close the tab or refresh — the job keeps running and you can get notified when it is ready.",
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
      "Instant is free and private on this device — download only. It does not save to Library, run bulk jobs, process video, remove backgrounds, or power the Chrome extension. Cloud uses credits and unlocks Library, video watermark removal, background cutouts, bulk processing, and extension workflows.",
  },
  {
    question: "Does Unmark work on Gemini 16:9 and 9:16 exports?",
    answer:
      "Yes. Unmark is optimized for common Gemini aspect ratios (16:9 landscape and 9:16 portrait) and keeps the original resolution when you download.",
  },
  {
    question: "Is there a Chrome extension for Gemini watermark removal?",
    answer:
      "Yes. Unmark for Gemini pairs with Cloud — queue prompts on Gemini or Google Flow, remove the sparkle automatically, and download clean PNGs. Sign in on Unmark so extension jobs use your credits and appear in Library. For video and background removal, use the website.",
  },
  {
    question: "Is removing the Gemini watermark legal?",
    answer:
      "Use Unmark on content you created or have rights to use. Google adds the visible sparkle to AI outputs you generate; many creators remove it before publishing client work, ads, or social posts. Follow platform rules and disclose AI content where required.",
  },
  {
    question: "What happens to my video if I refresh the page?",
    answer:
      "With Unmark Cloud, video jobs run on our servers and stay in your Library. You can also get notified when encoding finishes. Browser-only removers often lose the job if you refresh or close the tab.",
  },
  {
    question: "Can I download a Gemini video without the watermark?",
    answer:
      "Export the original clip from Gemini, Veo, or Google Flow, upload it to Unmark Cloud, and download the cleaned MP4 from your Library when processing finishes. Unmark preserves frame rate and resolution where possible.",
  },
  {
    question: "Does Gemini Advanced remove the watermark for me?",
    answer:
      "No. Google does not offer a setting to disable the visible sparkle on Gemini, Veo, Imagen, or Nano Banana exports. Removing it after export with a Gemini watermark remover like Unmark is the practical route to a clean file.",
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
