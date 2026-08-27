export const HILLTOP_WATCH_AD_ZONE =
  "https://fond-appointment.com/bLXiVfs.dyGNlE0/YsWOc_/PeomY9rukZ/UflukPP-TFcczFNETTUKxwNmDgU/t/NbzQMc1BN/T/Er0dOAQQ";

/** Exact src from the Hilltop popunder snippet (protocol-relative). */
export const HILLTOP_POPUNDER_ZONE_SRC =
  "//crookedagreement.com/cqDN9c6.bN2s5rlCS/WfQT9RNfzHMx1/NDT-Us1LNOys0w3xM/zCUP1LNyToYKxz";

const POPUNDER_SRC_MARKER = "cqDN9c6.bN2s5rlCS";

export function pathAllowsHilltopPopunder(pathname: string): boolean {
  if (pathname === "/") return true;
  return (
    pathname === "/extension" ||
    pathname === "/product" ||
    pathname === "/android" ||
    pathname === "/skills" ||
    pathname === "/tools" ||
    pathname.startsWith("/tools/") ||
    pathname === "/guides" ||
    pathname.startsWith("/guides/")
  );
}

function injectHilltopScript(id: string, src: string) {
  if (typeof document === "undefined") return;
  if (document.getElementById(id)) return;

  const s = document.createElement("script") as HTMLScriptElement & {
    settings: Record<string, unknown>;
  };
  s.id = id;
  s.settings = {};
  s.async = true;
  s.referrerPolicy = "no-referrer-when-downgrade";
  s.src = src;
  document.head.appendChild(s);
}

export function loadHilltopWatchAd() {
  injectHilltopScript("hilltop-ads-loader-watch", HILLTOP_WATCH_AD_ZONE);
}

export function hilltopInlineLoader(src: string): string {
  return `(function(settings){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = settings || {};
s.src = ${JSON.stringify(src)};
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`;
}

export const HILLTOP_WATCH_AD_SCRIPT = hilltopInlineLoader(HILLTOP_WATCH_AD_ZONE);

/**
 * Hilltop popunder snippet, plus a path gate so it only inserts on marketing
 * pages. The inner loader matches the vendor tag (zteh / insertBefore).
 */
export const HILLTOP_POPUNDER_SCRIPT = `(function(){
var p = location.pathname || "/";
if (p !== "/" && p.indexOf("/tools") !== 0 && p.indexOf("/guides") !== 0 && p !== "/extension" && p !== "/product" && p !== "/android" && p !== "/skills") return;
if (document.querySelector('script[src*="${POPUNDER_SRC_MARKER}"]')) return;
(function(zteh){
var d = document,
    s = d.createElement("script"),
    l = d.scripts[d.scripts.length - 1];
s.settings = zteh || {};
s.src = ${JSON.stringify(HILLTOP_POPUNDER_ZONE_SRC)};
s.async = true;
s.referrerPolicy = "no-referrer-when-downgrade";
if (l && l.parentNode) l.parentNode.insertBefore(s, l);
else (d.body || d.head).appendChild(s);
})({});
})()`;

export function loadHilltopPopunder() {
  if (typeof document === "undefined") return;
  if (!pathAllowsHilltopPopunder(location.pathname || "/")) return;
  if (document.querySelector(`script[src*="${POPUNDER_SRC_MARKER}"]`)) return;
  if (document.getElementById("hilltop-popunder-boot")) return;

  const el = document.createElement("script");
  el.id = "hilltop-popunder-boot";
  el.text = HILLTOP_POPUNDER_SCRIPT;
  (document.body || document.head).appendChild(el);
}
