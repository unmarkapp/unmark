export const SITE_URL = "https://unmark.ink";

export const SITE_NAME = "Unmark";

/** Primary SERP title — keyword first for non-branded queries. */
export const SITE_TITLE_DEFAULT =
  "Gemini Watermark Remover — Unmark (Sparkle Cleanup)";

export const SITE_TAGLINE =
  "Remove Gemini watermarks instantly in your browser, or use Cloud for Library saves, bulk processing, and the Chrome extension. Built for 16:9 and 9:16 Gemini exports.";

export const SITE_KEYWORDS = [
  "gemini watermark remover",
  "remove gemini watermark",
  "remove gemini sparkle",
  "gemini stamp remover",
  "how to remove gemini watermark",
  "google gemini watermark remover",
  "ai watermark remover gemini",
  "clean gemini images",
  "unmark",
];

export const FAQ_ITEMS = [
  {
    question: "How do I remove the Gemini watermark from an image?",
    answer:
      "Drop a Gemini export on Unmark. Instant cleans one image in your browser with no account. Cloud saves the result to your Library, supports bulk, and works with the Chrome extension.",
  },
  {
    question: "What is the Gemini sparkle / stamp on images?",
    answer:
      "Google Gemini adds a small four-point sparkle watermark, usually in a corner of AI-generated images. Unmark is built specifically to remove that Gemini sparkle — not every generic watermark.",
  },
  {
    question: "What’s the difference between Instant and Cloud?",
    answer:
      "Instant is free and private on this device — download only. It does not save to Library, run bulk jobs, or power the Chrome extension. Cloud uses credits and unlocks Library, bulk processing, and extension workflows.",
  },
  {
    question: "Can I remove a Gemini watermark for free?",
    answer:
      "Yes. Instant mode cleans a single image in your browser with no sign-in. Sign up for Cloud when you want Library history, bulk cleanup, or the extension.",
  },
  {
    question: "Does Unmark work on Gemini 16:9 and 9:16 exports?",
    answer:
      "Yes. Unmark is optimized for common Gemini aspect ratios (16:9 landscape and 9:16 portrait) and keeps the original resolution when you download.",
  },
  {
    question: "Is there a Chrome extension for Gemini watermark removal?",
    answer:
      "Yes. Unmark for Gemini pairs with Cloud — sign in on Unmark so extension jobs can use your credits and appear in Library. Instant browser mode does not connect to the extension.",
  },
] as const;
