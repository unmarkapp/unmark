/** Public site URL (www — apex unmark.ink requires separate DNS). */
export const SITE_URL = "https://www.unmark.ink";

export const SITE_NAME = "Unmark";

/** Chrome Web Store listing for Unmark for Gemini. */
export const CHROME_WEB_STORE_URL =
  "https://chrome.google.com/webstore/detail/helligpoigiemhikanpdlnedjehhjhni";

/** Product Hunt product page (canonical, no UTM). */
export const PRODUCT_HUNT_PROFILE_URL =
  "https://www.producthunt.com/products/unmark-2";

/** Product Hunt product page + featured badge. */
export const PRODUCT_HUNT_URL =
  "https://www.producthunt.com/products/unmark-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-unmark-2";

export const PRODUCT_HUNT_BADGE_SRC =
  "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1222339&theme=dark&t=1786642666647";

/** Hosted Unmark MCP endpoint for Claude Connectors and other remote MCP clients. */
export const MCP_SERVER_URL = "https://mcp.unmark.ink/mcp";

/**
 * Public App Store and Play Store listings.
 * Empty until listings are public — Apps cards and the header Apps link show Soon
 * unless Android closed testing is live (see ANDROID_EARLY_ACCESS_URL).
 * https://apps.apple.com/us/app/unmark/id6756499973
 * https://play.google.com/store/apps/details?id=ink.unmark.app
 */
export const IOS_APP_URL = "";
export const ANDROID_APP_URL = "";

/** Play application id (release `applicationId`, not the Kotlin namespace). */
export const ANDROID_PACKAGE_ID = "ink.unmark.app";

/**
 * Closed testing opt-in. Testers must open this URL and tap Become a tester —
 * that is what Play counts toward the 12-tester / 14-day production gate.
 * Play Console → Testing → Closed testing → Testers → Copy link.
 * Replace if Console shows a different URL.
 */
export const ANDROID_EARLY_ACCESS_URL = `https://play.google.com/apps/testing/${ANDROID_PACKAGE_ID}`;

/** Install / join URL: production listing when live, otherwise closed testing. */
export const ANDROID_INSTALL_URL = ANDROID_APP_URL || ANDROID_EARLY_ACCESS_URL;

/** Header Apps badge: hide when a public store listing exists. */
export const APPS_NAV_BADGE: "Soon" | "Early access" | null =
  ANDROID_APP_URL || IOS_APP_URL
    ? null
    : ANDROID_EARLY_ACCESS_URL
      ? "Early access"
      : "Soon";

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
    badge: "Cloud",
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
      "Drop a Gemini, Imagen, or Nano Banana export on Unmark. Instant cleans one still in your browser with no account — PNG, JPG, or WebP, original resolution, no Unmark logo on the download. Use the drop zone on the homepage or on the image guide. Cloud is the next step when you want Library history, a folder of stills, or the Chrome extension to clean as you generate on Gemini or Google Flow. Instant will not clean an MP4; for video, drop the clip so Cloud can walk every frame. If Auto misses an odd placement, run the original export in Cloud and inspect the Library preview before you download.",
  },
  {
    question: "How do I remove the Gemini watermark from a video?",
    answer:
      "Export the original MP4, MOV, or WebM from Gemini, Veo, or Google Flow — not a screen recording or a chat-app recompress. Drop the clip on Unmark (the homepage or a video guide). Cloud finds the sparkle on every frame and saves the clean file to Library. Sign in only if Unmark asks so the job can be stored. You can close the tab; turn on email notify if you want a ping when it is ready. New accounts include credits to try a short clip. Limits are listed on the upload card (short videos, up to 1080p, within the file-size cap).",
  },
  {
    question: "Can Unmark remove image backgrounds?",
    answer:
      "Yes. Open Background removal under Tools, drop a PNG, JPG, or WebP, and download a transparent cutout for portraits, products, and AI stills. Sign in when Unmark asks so the PNG can save to Library. If the still still shows a Gemini sparkle, clean it with Instant or Cloud first, then cut out the cleaned file so the logo is not left on the subject. Hair, glasses, and product edges are the usual stress tests — preview the checkerboard before you download. Unmark does not relight the subject or invent a new backdrop; pair the PNG with your own layout.",
  },
  {
    question: "Does this work with Google Flow and Veo videos?",
    answer:
      "Yes. Unmark removes the visible Gemini and Veo sparkle from video exports out of Google Flow, Veo, and Gemini. Drop the original clip; Cloud keeps it in Library until you download. Stills from the same Flow board can use free Instant. You do not need a separate product for Flow vs Gemini — the sparkle is the same family of mark. Screen-recording the Flow player captures UI chrome Unmark is not meant to erase. For a stack of Flow stills, use bulk Cloud or the Chrome extension instead of treating every asset as video.",
  },
  {
    question: "What is the Gemini sparkle / stamp on images?",
    answer:
      "Google Gemini adds a small four-point sparkle, usually in a corner of AI-generated images and video frames. It is burned into the export — there is no Gemini setting that turns it off. Unmark is built for that visible mark, not for channel logos, captions, or stamps from other generators. The same sparkle family appears on Imagen, Nano Banana, Veo, and Google Flow exports. Cropping the corner is a poor substitute: you lose composition, and a tiled or inset sparkle can remain. Instant targets stills; Cloud targets video and saved jobs.",
  },
  {
    question: "Can I remove a Gemini watermark for free?",
    answer:
      "Yes. Instant mode cleans a single image in your browser with no sign-in, original resolution, and no Unmark logo. That is the free Gemini watermark remover. Cloud features — video, Library, bulk, background cutouts, and the Chrome extension — use credits. New accounts get free signup credits so you can try a short clip or a cutout before you buy a pack. If you only needed one portrait for a slide, Instant is the whole product. If you ship a Reels calendar or client ads, Cloud is the part that keeps files in one place.",
  },
  {
    question: "What's the difference between Instant and Cloud?",
    answer:
      "Instant is free in your browser for one still: drop a Gemini image, download the PNG, no account. Cloud saves to Library and unlocks video watermark removal, background cutouts, bulk stills, and the Chrome extension. Use Instant when you have a single PNG and a deadline. Use Cloud when the sparkle is on every frame of an MP4, when you need yesterday’s file again, or when you generate on Gemini or Flow all day. Both remove the same visible sparkle; they differ in where the file lives and which media types they cover.",
  },
  {
    question: "Does Unmark work on Gemini 16:9 and 9:16 exports?",
    answer:
      "Yes. Unmark is built for common Gemini landscape and portrait exports and keeps the original resolution when you download. Clean a 9:16 story still with Instant before you crop to 1:1 — cropping first can clip or move the sparkle. The same advice applies to Veo: clean the 9:16 or 16:9 clip, then crop in your editor. Square Gemini stills work too. Video still has to fit the homepage length, resolution, and size limits.",
  },
  {
    question: "Is there a Chrome extension for Gemini watermark removal?",
    answer:
      "Yes. Unmark for Gemini works on Gemini and Google Flow in Chrome: queue prompts, remove the sparkle, and download cleaned images so you are not exporting one file at a time. Sign in on Unmark so results appear in Library. Video and background removal stay on the website. The extension is optional — Instant on the site is enough for a one-off still. Install from the Chrome Web Store listing linked on unmark.ink/extension.",
  },
  {
    question: "Is removing the Gemini watermark legal?",
    answer:
      "Use Unmark on content you created or have rights to use. Google adds the visible sparkle to AI outputs you generate; many creators remove it before publishing client work, ads, or social posts. Follow platform rules and disclose AI content where required — removing the sparkle does not replace those rules. Unmark does not claim to erase every provenance signal a platform might add, and it is not a tool for stripping marks from other people’s work. If you are unsure about a commercial use, check the platform’s current AI-media policy and your client contract.",
  },
  {
    question: "What happens to my video if I refresh the page?",
    answer:
      "With Unmark Cloud, the clip stays in your Library even if you refresh or close the tab. You do not need to babysit the browser. Open Library when you come back, preview, and download. Turn on email notify in account settings if you want a ping when the file is ready. Instant stills never leave the browser tab — if you close Instant before you download, run the image again. That is the main reason video uses Cloud instead of Instant.",
  },
  {
    question: "Can I download a Gemini video without the watermark?",
    answer:
      "Yes. Export the original clip from Gemini, Veo, or Google Flow, drop it on Unmark Cloud, and download the cleaned MP4 from Library when it is ready. Start from Google’s file, not a TikTok or WhatsApp recompress. Unmark aims to keep resolution, frame rate, and audio. A screenshot of one frame is not a video download — use Instant for that still, and this path for the MP4. New accounts include credits to try a short clip.",
  },
  {
    question: "Does Gemini Advanced remove the watermark for me?",
    answer:
      "A Gemini plan does not, by itself, strip the sparkle from files you already downloaded. Around mid-August 2026 Google began rolling out a setting in Gemini and Flow that can hide the visible watermark on new generations for some regions and accounts. That toggle is not universal, and it does not clean exports sitting on your disk. Unmark is for those files: Instant for a still in the browser, Cloud for Veo and Flow clips in Library.",
  },
  {
    question: "Google added a watermark-off toggle — do I still need Unmark?",
    answer:
      "Yes, if you already exported media with the sparkle, or if the native Gemini/Flow toggle is not available on your account. Google’s mid-August 2026 setting (geo- and plan-restricted) can hide the visible mark on some new generations. It does not walk back through Library-less downloads you made last week. Unmark Instant still cleans one Gemini still in the browser with no account; Cloud still cleans Veo and Google Flow video. If Google hands you an unmarked file going forward, you do not need Unmark for that file.",
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
