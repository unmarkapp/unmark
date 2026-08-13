# Launch kit — list Unmark for people ready to use it

**Canonical links**
- Home (Instant): https://www.unmark.ink
- Product (directories): https://www.unmark.ink/product
- Tools: https://www.unmark.ink/tools
- Background cutout: https://www.unmark.ink/tools/background-removal
- Extension: https://www.unmark.ink/extension  
  Store: https://chrome.google.com/webstore/detail/helligpoigiemhikanpdlnedjehhjhni

**One-liner**  
Unmark cleans AI media — remove Gemini sparkles from images and videos, or cut out the subject.

**Tagline**  
Free Instant image cleanup. Cloud for video, Library, background removal, and Chrome.

---

## Product Hunt

**Product page:** https://www.producthunt.com/products/unmark-2  

**Name:** Unmark  

**Tagline (shown on embed):**  
Remove Gemini & Veo watermarks from images and video  

**Topics:** Artificial Intelligence, Design Tools, Chrome Extensions, Photo & Video  

**Featured badge (site footer):**

```html
<a href="https://www.producthunt.com/products/unmark-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-unmark-2" target="_blank" rel="noopener noreferrer"><img alt="Unmark - Remove Gemini &amp; Veo watermarks from images and video | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1222339&theme=dark&t=1786642666647"></a>
```

**Card embed (site / Notion / launch posts):**

```html
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;border:1px solid #e0e0e0;border-radius:12px;padding:20px;max-width:500px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.05)">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
    <img alt="Unmark" width="64" height="64" style="width:64px;height:64px;border-radius:8px;object-fit:cover;flex-shrink:0" src="https://ph-files.imgix.net/92a31f15-3dad-4d03-a9d7-014a1a83a27e.png?auto=compress,format&codec=mozjpeg&cs=strip&fit=crop&h=80&w=80" />
    <div style="flex:1;min-width:0">
      <h3 style="margin:0;font-size:18px;font-weight:600;color:#1a1a1a;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Unmark</h3>
      <p style="margin:4px 0 0;font-size:14px;color:#666;line-height:1.4">Remove Gemini &amp; Veo watermarks from images and video</p>
    </div>
  </div>
  <a href="https://www.producthunt.com/products/unmark-2?embed=true&utm_source=embed&utm_medium=post_embed" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:4px;margin-top:12px;padding:8px 16px;background:#ff6154;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600">Check it out on Product Hunt →</a>
</div>
```

**Short link for bios / comments:**  
https://www.producthunt.com/products/unmark-2  

**Gallery / first comment — maker story (short):**

```
Unmark is for creators who export from Gemini, Veo, or Google Flow and need clean files before posting.

• Instant — free image watermark removal in the browser (no signup)
• Cloud — video watermark removal + Library
• Background removal — transparent PNG cutouts
• Chrome extension — clean on Gemini / Flow while you generate

Try Instant: https://www.unmark.ink
Full product: https://www.unmark.ink/product
```

**Launch day CTA:** Ask hunters to drop a Gemini PNG on Instant first (no account friction).

---

## Directory one-paragraph (Futurepedia, TAAFT, AlternativeTo, SaaSHub)

```
Unmark is an AI media cleanup tool: remove Gemini sparkle watermarks from images and videos, or cut out backgrounds for transparent PNGs. Instant mode cleans a single image free in the browser. Cloud unlocks video watermark removal, Library saves, bulk jobs, background removal, and a Chrome extension for Gemini and Google Flow. Start at https://www.unmark.ink/product
```

**Categories to pick:** AI image tools, Watermark removers, Background removers, Chrome extensions  

**Pricing note:** Free Instant + free signup credits; paid Cloud credit packs when payments are live.

---

## Screenshot / asset checklist

| # | Shot | Notes |
|---|------|--------|
| 1 | Home Instant drop zone | Brand first; cream/copper UI |
| 2 | Image before / after | Gemini sparkle vs clean |
| 3 | Video result | Short Veo/Flow clip cleaned |
| 4 | Background cutout | Checkerboard / transparent PNG |
| 5 | Chrome extension on Gemini | Optional sixth: Library grid |
| — | Logo / icon | Existing Unmark mark |
| — | Demo GIF (10–15s) | Drop → clean → download |

---

## Submit order

1. Ship site copy (`/`, `/product`, `/tools`) — done in repo  
2. Paste Chrome Web Store copy from `chrome-web-store.md`  
3. Product Hunt launch day  
4. AI directories (same paragraph + `/product` URL)  
5. iOS — set `IOS_APP_URL` in `lib/seo.ts` only when TestFlight/App Store URL exists  

---

## iOS (deferred)

Do **not** publish App Store or TestFlight links until a real URL exists.  
Site currently shows “iOS app coming soon” via empty `IOS_APP_URL` in [`lib/seo.ts`](../../lib/seo.ts).
