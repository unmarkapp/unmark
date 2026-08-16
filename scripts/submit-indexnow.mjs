#!/usr/bin/env node
/**
 * Ping Bing / IndexNow with the public sitemap URLs.
 * Key file: /c2e180682a0f430c9e20aace5acd7dfe.txt
 *
 *   node scripts/submit-indexnow.mjs
 */

const KEY = "c2e180682a0f430c9e20aace5acd7dfe";
const HOST = "www.unmark.ink";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  "https://www.unmark.ink/",
  "https://www.unmark.ink/product",
  "https://www.unmark.ink/tools",
  "https://www.unmark.ink/tools/background-removal",
  "https://www.unmark.ink/tools/create",
  "https://www.unmark.ink/guides",
  "https://www.unmark.ink/guides/remove-gemini-watermark",
  "https://www.unmark.ink/guides/remove-gemini-video-watermark",
  "https://www.unmark.ink/guides/google-flow-watermark-remover",
  "https://www.unmark.ink/guides/remove-veo-watermark",
  "https://www.unmark.ink/guides/free-gemini-watermark-remover",
  "https://www.unmark.ink/guides/mcp-server",
  "https://www.unmark.ink/extension",
  "https://www.unmark.ink/developers",
  "https://www.unmark.ink/skills",
];

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS,
  }),
});

const text = await response.text();
console.log(response.status, text || "(empty)");
if (!response.ok && response.status !== 202) {
  process.exit(1);
}
