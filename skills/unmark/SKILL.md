---
name: unmark
description: Remove visible Gemini sparkle watermarks from local image files via Unmark Cloud, or call Unmark MCP when the connector is available. Use when the user wants an agent to clean Gemini, Veo, Nano Banana, or Google Flow stills in a repo, batch a folder of exports, or save cleaned PNG/JPG/WebP next to source files.
---

# Unmark

Clean visible Gemini sparkles on stills as part of a larger agent task.

Prefer simpler options first:

1. Website Instant (no account): https://www.unmark.ink/
2. Hosted MCP connector: https://www.unmark.ink/developers
3. This skill (local files in a workspace)

## If Unmark MCP tools are already connected

Call `remove_watermark` (and `remove_background` / `get_job_status` when needed). Pass a public `image_url`, Unmark share link (`https://www.unmark.ink/s/{jobId}`), or `image_base64`. Do not pass a local path to hosted MCP — the server cannot read the user's disk.

## Local files (this skill)

1. Confirm `UNMARK_BEARER_TOKEN` is set (same token as Unmark MCP stdio). API defaults to `https://api.unmark.ink`.
2. Pick an explicit `--output` file or `--out-dir` before running. If the user did not specify one, choose it and tell them where files will be written.
3. Run from this skill directory:

```bash
node scripts/run.mjs remove <input.png> --output <clean.png>
node scripts/run.mjs remove <input-dir> --out-dir <clean-dir>
```

Add `--json` when the caller needs machine-readable paths.

4. Report the written path(s). Failures that mention credits: send the user to https://www.unmark.ink/account. Auth failures: https://www.unmark.ink/guides/mcp-server

Stills only (PNG, JPG, WebP). Video and Instant-in-browser cleanup stay on the website. Results also appear in the user's Unmark Library.
