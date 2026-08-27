import { HILLTOP_WATCH_AD_SCRIPT } from "@/lib/hilltopAds";

export function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex, nofollow" />
  <meta name="referrer" content="no-referrer-when-downgrade" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ad</title>
  <style>
    html, body {
      margin: 0;
      min-height: 100%;
      background: #111;
      color: #a3a3a3;
      font: 13px/1.4 system-ui, sans-serif;
    }
  </style>
  <script>
    ${HILLTOP_WATCH_AD_SCRIPT}
  </script>
  <script>
    (function () {
      var filled = false;
      var emptySent = false;
      function ping(type, via) {
        try {
          parent.postMessage({ type: type, via: via || "click" }, location.origin);
        } catch (e) {}
      }
      function markFilled() {
        if (filled) return;
        filled = true;
        ping("unmark-ad-filled");
      }
      function markEmpty() {
        if (filled || emptySent) return;
        emptySent = true;
        ping("unmark-ad-empty");
      }
      function hasCreative() {
        var body = document.body;
        if (!body) return false;
        if (body.children.length > 0) return true;
        if (document.querySelector("iframe, img, a, video, canvas, object, embed")) return true;
        return false;
      }
      document.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || t === document.documentElement || t === document.body) return;
        ping("unmark-ad-engaged", "click");
      }, true);
      window.addEventListener("blur", function () { ping("unmark-ad-engaged", "blur"); });
      document.addEventListener("error", function (e) {
        var t = e.target;
        if (t && t.tagName === "SCRIPT") markEmpty();
      }, true);
      var observer = new MutationObserver(function () {
        if (hasCreative()) markFilled();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(function () {
        if (hasCreative()) markFilled();
        else markEmpty();
      }, 4000);
    })();
  </script>
</head>
<body></body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
