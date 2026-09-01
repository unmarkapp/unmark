export const ADSTERRA_WATCH_AD_ZONE =
  "https://fond-appointment.com/bLXiVfs.dyGNlE0/YsWOc_/PeomY9rukZ/UflukPP-TFcczFNETTUKxwNmDgU/t/NbzQMc1BN/T/Er0dOAQQ";

/** Adsterra popunder script src. */
export const ADSTERRA_POPUNDER_ZONE_SRC =
  "https://stretchadjoiningperspective.com/96/f4/76/96f4765a538aba09caf48ff6e6fe8c6f.js";

const POPUNDER_SRC_MARKER = "96f4765a538aba09caf48ff6e6fe8c6f";

function injectAdsterraScript(id: string, src: string) {
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

export function loadAdsterraWatchAd() {
  injectAdsterraScript("adsterra-ads-loader-watch", ADSTERRA_WATCH_AD_ZONE);
}

export function adsterraInlineLoader(src: string): string {
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

export const ADSTERRA_WATCH_AD_SCRIPT = adsterraInlineLoader(ADSTERRA_WATCH_AD_ZONE);

/** Adsterra popunder snippet — loads on every page. */
export const ADSTERRA_POPUNDER_SCRIPT = `(function(){
if (document.querySelector('script[src*="${POPUNDER_SRC_MARKER}"]')) return;
var s = document.createElement("script");
s.src = ${JSON.stringify(ADSTERRA_POPUNDER_ZONE_SRC)};
s.async = true;
(document.head || document.body).appendChild(s);
})()`;

export function loadAdsterraPopunder() {
  if (typeof document === "undefined") return;
  if (document.querySelector(`script[src*="${POPUNDER_SRC_MARKER}"]`)) return;
  injectAdsterraScript("adsterra-popunder-loader", ADSTERRA_POPUNDER_ZONE_SRC);
}
