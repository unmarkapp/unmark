# Gemini alpha maps (browser reverse-alpha-blend)

Alpha capture PNGs (`bg_48.png`, `bg_96.png`) and the reverse alpha blending
approach used by Unmark’s Instant (browser) and Cloud (worker) paths are adapted
from open MIT implementations of Allen Kuo’s reverse-alpha-blend method for
Gemini’s visible sparkle watermark.

Credits:
- Allen Kuo — reverse alpha blending method / GeminiWatermarkTool
- Downstream MIT ports (e.g. winterbang/gemini-watermark-remover geometry & maps)

OpenCV inpainting is only a Cloud fallback when reverse alpha blend does not apply.
