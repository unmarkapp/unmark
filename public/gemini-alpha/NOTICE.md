# Gemini alpha maps (browser reverse-alpha-blend)

Alpha capture PNGs and reverse alpha blending used by Unmark Instant
(browser) and Cloud (worker) are adapted from open MIT implementations of
Allen Kuo’s reverse-alpha-blend method for Gemini’s visible sparkle watermark.

Files:
- `bg_48.png` / `bg_96.png` — V1 (pre-Gemini 3.5) captures
- `bg_36_v2.png` / `bg_96_v2.png` — V2 (Gemini 3.5+) captures from
  Allen Kuo GeminiWatermarkTool (`bg_b_36_png` / `bg_b_96_png`)

Credits:
- Allen Kuo — reverse alpha blending method / GeminiWatermarkTool (MIT)
- Downstream MIT ports: winterbang/gemini-watermark-remover,
  GargantuaX/gemini-watermark-remover

OpenCV inpainting is only a Cloud/Instant fallback when reverse alpha blend
does not apply.
