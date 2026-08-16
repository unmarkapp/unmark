# Unmark web — negative UAT

User-acceptance cases for **failure, rejection, and blocked** paths on the website. A case **passes** only if the product refuses the action, shows a clear error, and does **not** charge credits, create a Library job, or claim SynthID/C2PA removal.

Environment: production `https://www.unmark.ink` (or staging). UTC day for daily credits.

Record: ID · Pass/Fail · Tester · Date · Notes (screenshot if fail).

---

## Test accounts

| ID | Account | Setup |
| --- | --- | --- |
| A0 | Signed out | Incognito, no Google session |
| A1 | Signed in, 0 Clean credits | Spend daily free; do not buy a pack |
| A2 | Signed in, Clean credits ≥ 1, Create (paid) = 0 | New day grant only; no pack |
| A3 | Signed in, Library full | Fill Library to `library_limit` (default 50) |
| A4 | Signed in, pack credits | Bought a credit pack (`paid_fast_credits` > 0) |
| A5 | Signed in, Drive not connected | Default storage Unmark |

Fixtures: 1 Gemini still with sparkle; 1 photo with no sparkle; 1 corrupt `.jpg`; 1 `.pdf`; 1 `.txt` renamed to `.jpg`; 11 stills; 2 short MP4s; 1 MP4 > 100 MB; 1 MP4 > 60s; 1 4K MP4; 1 mixed drop (image + video).

---

## 1. Upload and file type

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-UP-01 | A0 | Open homepage, click drop zone, cancel picker | Stay on empty Clean. No toast. No job. |
| N-UP-02 | A0 | Drop a PDF or `.txt` | Toast **Please select an image or video.** File not accepted. |
| N-UP-03 | A0 | Drop a file named `photo.jpg` that is not an image (e.g. text) | **Failed to load image.** Ready card not shown. |
| N-UP-04 | A0 | Drop image + video together | **Choose either images or one video, not both.** |
| N-UP-05 | A0 | Drop 2 videos | **Upload one video at a time.** |
| N-UP-06 | A0 | Drop 11 images while signed out | **Bulk cleanup needs Cloud sign-in…** No 11th file queued. |
| N-UP-07 | A2 | Drop 11 images while signed in | Toast **You can upload up to 10 images.** At most 10 in the bulk queue. |
| N-UP-08 | A0 | Drop a 1×1 or tiny PNG, Instant | Error such as **Image too small for Gemini watermark region**, or cleanup refused. No crash. |
| N-UP-09 | A0 | Drop an HEIC/AVIF the browser cannot decode | **Failed to load image.** |

---

## 2. Auth — Cloud, Library, tools (signed out)

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-AU-01 | A0 | One image → switch to **Cloud** → Remove | CTA **Sign in for Cloud**. Click starts Google sign-in. No upload without session. |
| N-AU-02 | A0 | Switch to **Manual** (forces Cloud) without drawing a box | Remove disabled. Hint to draw a box. |
| N-AU-03 | A0 | Upload a valid Veo/Gemini MP4 | Video card. CTA **Sign in to clean video**. No Cloud job. |
| N-AU-04 | A0 | Open `/library` | Prompted to sign in. No other user’s jobs. |
| N-AU-05 | A0 | Open `/account` | Signed out / redirect. No balance, packs, or checkout. |
| N-AU-06 | A0 | Open `/tools/background-removal` and upload | **Sign in to use background removal.** No job. |
| N-AU-07 | A0 | Open Create tab on home | **Coming soon** overlay. Prompt/Generate not usable. |
| N-AU-08 | A0 | Call Cloud API from another tab with no cookie (`POST /v1/remove-watermark`) | 401 **Sign in required** / invalid session. |
| N-AU-09 | A2 then sign out | Mid Cloud job, sign out, refresh | Cannot poll as that user. Library empty until sign-in. |

---

## 3. Credits — Clean Cloud (do not spend paid packs unless noted)

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-CR-01 | A1 | Cloud, one image, Remove | **Out of credits** / need 1. Button **Out of credits**. No job. Balance stays 0. |
| N-CR-02 | A1 | Video ≤ 5s (1 credit) | Sign-in OK, credits block. Need 1. No job. |
| N-CR-03 | A2 with exactly 1 credit | Video ~12s (3 credits) | Need 3, have 1. No job. Balance still 1. |
| N-CR-04 | A1 | 3 images bulk | CTA **Need 3 credits**. Clean disabled. No batch spend. |
| N-CR-05 | A2 with 2 credits | 3-image bulk | **Insufficient fast credits. Need 3, have 2.** No jobs. Balance 2. |
| N-CR-06 | A2 | Instant (not Cloud) with 0 paid, daily leftover optional | Instant still runs. Credits unchanged. |
| N-CR-07 | A2 | After a successful Cloud clean, balance −1 only | Second Cloud with 0 credits then blocked. |
| N-CR-08 | A2 | Double-click Remove Cloud | One job, one credit. Button disabled while processing. |
| N-CR-09 | A0 | Stay signed out 10 days, then Instant | Instant works. No credit grant (no account). |
| N-CR-10 | A2 | Do not open app/web for 10 days, then sign in | **+5 today only**, not 10×5. Unused leftover from last visit may remain; missed days are **not** backfilled. |

---

## 4. Create vs Clean wallet

Create on web is currently **Coming soon**. Still verify copy and that daily free cannot buy Create if the flag is turned on later.

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-GE-01 | A0/A2 | Home → Create | Overlay **Create on the web** / coming soon. Generate not clickable. |
| N-GE-02 | A2 | Copy on Create and Account | Daily free is **Clean only**. Create needs pack credits. |
| N-GE-03 | A2 | Account balances | Clean shows `fast_credits`. Create shows `paid_fast_credits` / create credits **0**. |
| N-GE-04 | A4 | Buy pack, do not run Create (web disabled) | Pack increases both Clean and Create purchasable pool. Daily free still Clean-only. |

If `GENERATE_WEB_ENABLED` is true on staging:

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-GE-05 | A2, Create=0 | Prompt ≥ 8 chars, Generate | 402 **Create uses purchased credits.** Daily free unchanged. No image. |
| N-GE-06 | A4 with 1 paid credit | Nano Banana 2 (2 credits) | 402 need 2, have 1. No image. |
| N-GE-07 | A4 | Prompt `hi` (< 8 chars) | **Prompt must be at least 8 characters.** No spend. |
| N-GE-08 | A4 | Empty prompt | Client blocks; no API spend. |

---

## 5. Instant vs Cloud behavior

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-IN-01 | A0 | Instant on a photo **with no** Gemini sparkle | Must not claim SynthID/C2PA removal. Sparkle engine may no-op or leave image; no Cloud job, no Library save. |
| N-IN-02 | A0 | Instant success | Toast that result is **local / download only**. Not in Library after sign-in. |
| N-IN-03 | A0 | Instant, then switch to Cloud without signing in | Sign-in required. Instant result not auto-uploaded. |
| N-IN-04 | A1 | Manual mode | Engine locked to Cloud. Instant toggle hidden/disabled. |
| N-IN-05 | A0 | Manual, no selection | Remove disabled: **Draw a box around the Gemini sparkle**. |
| N-IN-06 | A2 | Manual box outside image / 0×0 (if UI allows) | API **Coordinates cannot be negative** / **Region is outside image**. No credit if job not created. |
| N-IN-07 | A0 | Try a sample, then fail `fetch` of `/demo/sample-clean-before.jpg` (block in DevTools) | **Could not load the sample image.** |
| N-IN-08 | A0 | Copy that Unmark removes **invisible** watermarks / SynthID | Marketing and UI must **not** say that. Fail the case if they do. |

---

## 6. Video

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-VID-01 | A0 | MP4 > 100 MB | **Video too large (max 100 MB).** |
| N-VID-02 | A0 | MP4 duration > 60s | **Video too long (max 60s)** with actual duration. |
| N-VID-03 | A0 | Corrupt / non-video named `.mp4` | **Failed to load video.** |
| N-VID-04 | A2 | 4K / short edge > 1080 (server) | **Video too large** / resolution rejected. No job. Credits unchanged. |
| N-VID-05 | A2 | `.mkv` or audio-only | **File must be a video (mp4, mov, webm).** |
| N-VID-06 | A1 | Valid ≤60s / 1080p / <100MB | Credits block before upload completes as a paid job. |
| N-VID-07 | A0 | Instant not offered for video | Cloud-only copy. No fake in-browser video clean. |

---

## 7. Bulk Cloud

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-BK-01 | A0 | Drop 2–10 images signed out | **Bulk cleanup needs Cloud sign-in.** Instant must **not** run on multiple files. No queue. |
| N-BK-02 | A1 | 2–10 images | **Need N credits** / out of credits. Clean disabled. |
| N-BK-03 | A3 with credits | 2 images, Library at limit | **Library full (used/limit).** Buy storage or delete. No batch. Credits not deducted (or restored if prepaid failed). |
| N-BK-04 | A3 with 1 slot left | 3-image bulk | Library full for need=3. No partial silent fill that over-limit without error. |
| N-BK-05 | A2 | Clear queue while processing | Reset disabled while processing/zipping. |
| N-BK-06 | A2 | Download zip before any completed | Zip disabled. |
| N-BK-07 | A2 | One image in batch is invalid type if client is bypassed | Server **File must be an image** / invalid image for that file; others may error or restore credit for uncreated jobs. UI shows failed rows. |
| N-BK-08 | A2 | Image > 20 MB in bulk | **too large (max 20 MB)** for that file. |

---

## 8. Library

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-LB-01 | A0 | Direct `/library` | No jobs from other accounts. |
| N-LB-02 | A2 | Open another user’s `job_id` in `/library` or API `GET /v1/jobs/{id}` | 404 **Job not found**. |
| N-LB-03 | A2 | Delete while request in flight, double-click Delete | One delete. No crash. |
| N-LB-04 | A2 | Download with blocked result URL (DevTools fail) | **Download failed**. |
| N-LB-05 | A3 | Cloud clean while full | **Library full**. CTA to Account / delete. |
| N-LB-06 | A2 | Background-remove a **video** Library item | **Background removal supports images only** or control disabled. |
| N-LB-07 | A2 | Background-remove a job that is still processing | **Job is not completed yet**. |
| N-LB-08 | A2 | Background-remove a job that is already a cutout | **This job is already a background removal**. |
| N-LB-09 | A3 | Cutout when Library full | Blocked with library-full message. |
| N-LB-10 | A2 | Expired / unsigned share URL `/s/{jobId}` | 403 expired/invalid. Not a public listing of the Library. |

---

## 9. Background removal tool (`/tools/background-removal`)

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-BG-01 | A0 | Upload | Sign in required. |
| N-BG-02 | A2 | Non-image | **Please choose a valid image file.** |
| N-BG-03 | A2 | File > 25 MB (client) | **File is too large (max 25 MB).** |
| N-BG-04 | A1 | Valid image, 0 credits | Error from API / insufficient credits. No cutout. |
| N-BG-05 | A3 | Valid image, Library full | Library full. |

---

## 10. Account, checkout, storage

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-AC-01 | A0 | `/account` | No purchase UI for anonymous user. |
| N-AC-02 | A2 | Checkout then **cancel** on Stripe/provider | Return URL, **no** credits added. Error or cancelled state, not “success”. |
| N-AC-03 | A2 | Buy with network blocked on `startCheckout` | **Could not start checkout** (or equivalent). `buying` unlocks. |
| N-AC-04 | A2 | Double-click Buy | One checkout session. Button disabled while `buyingCode` set. |
| N-AC-05 | A5 | Set default storage to Google Drive **without** connecting | **Connect Google Drive before selecting it as default.** Unmark stays selected. |
| N-AC-06 | A5 | Drive OAuth cancel / invalid state | **Invalid or expired OAuth state** or return to Account without connecting. |
| N-AC-07 | A2 | Disconnect Drive while it is default | Reverts or errors clearly; new jobs must not assume Drive. |
| N-AC-08 | A2 | Toggle email notify with API down | Error shown. Toggle does not lie that it saved. |

---

## 11. Referrals and share bonus

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-RF-01 | A0 | Account earn/invite | Sign-in required. No invite code. |
| N-RF-02 | A2 | Apply own invite code | Rejected (invalid pair / cannot refer yourself). No extra credits. |
| N-RF-03 | A2 | Apply garbage code `XXXX` | Error. Balance unchanged. |
| N-RF-04 | A2 | Apply empty code | Apply disabled. |
| N-RF-05 | A2 | Share bonus twice same UTC day | **Share bonus already claimed today.** Credits not doubled. |
| N-RF-06 | A2 | Dismiss native share sheet | Abort. No error toast required. No bonus if share did not complete (product may only grant after share API). Confirm no silent grant on cancel. |

---

## 12. Canva

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-CV-01 | A2, Canva not connected | Edit in Canva | Connect flow or **canva_not_connected**. No hang. |
| N-CV-02 | A2 | Canva on a **video** job | **Canva import supports images only** or control hidden. |
| N-CV-03 | A2 | Canva on incomplete job | **Job is not completed yet** or button disabled. |
| N-CV-04 | A2 | Expired Canva token | **canva_reconnect_required** / reconnect CTA. |

---

## 13. Session, network, abuse

| ID | Pre | Steps | Expected |
| --- | --- | --- | --- |
| N-NW-01 | A0 | Offline, Try a sample | Load sample fails with error. No spinner forever. |
| N-NW-02 | A2 | Offline, Cloud Remove | Error, not a silent success. Credits unchanged. |
| N-NW-03 | A2 | 401 mid-poll (cleared cookie) | **Please sign in to remove Gemini watermarks** (or video equivalent). |
| N-NW-04 | A0 | Rapid Instant clicks | One run; UI stays disabled while `processing`. |
| N-NW-05 | A2 | Oversized POST (> server limit) | 413 **Request body too large**. |
| N-NW-06 | A0 | Hammer Instant / API | 429 **Too many requests** if rate limit hits; page recovers. |
| N-NW-07 | A2 | Job poll timeout (~2 min fail) | Failed status / timeout message. Check Library rather than infinite spinner. |

---

## 14. Product claims (must fail the UAT if copy is wrong)

| ID | Steps | Expected |
| --- | --- | --- |
| N-CL-01 | Home, footer, guides, extension page | States **visible Gemini sparkle only**, **not SynthID**. |
| N-CL-02 | Instant vs Cloud | Instant = no Library / bulk / video / extension. Cloud uses credits. |
| N-CL-03 | Create (when shown) | API image, **no Gemini app sparkle**, no Unmark pass required. Daily free is not Create. |

---

## Sign-off

| Suite | Cases | Pass | Fail | Blocked |
| --- | --- | --- | --- | --- |
| Upload | N-UP-01–09 | | | |
| Auth | N-AU-01–09 | | | |
| Credits | N-CR-01–10 | | | |
| Create | N-GE-01–08 | | | |
| Instant | N-IN-01–08 | | | |
| Video | N-VID-01–07 | | | |
| Bulk | N-BK-01–08 | | | |
| Library | N-LB-01–10 | | | |
| BG remove | N-BG-01–05 | | | |
| Account | N-AC-01–08 | | | |
| Referral | N-RF-01–06 | | | |
| Canva | N-CV-01–04 | | | |
| Network | N-NW-01–07 | | | |
| Claims | N-CL-01–03 | | | |

**Release rule:** no Fail on auth, credits, library-full, or claims (N-AU, N-CR, N-LB-05, N-CL). Other fails need a waiver note.

Tester: ______________  Date: ______________  Build/URL: ______________
