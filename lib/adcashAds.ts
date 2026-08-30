export const ADCASH_LIB_SRC = "//acscdn.com/script/aclib.js";
export const ADCASH_POP_ZONE_ID = "12055002";

export function pathAllowsAdcash(pathname: string): boolean {
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

function pathAllowedJs(): string {
  return `var p=location.pathname||"/";if(p!=="/"&&p.indexOf("/tools")!==0&&p.indexOf("/guides")!==0&&p!=="/extension"&&p!=="/product"&&p!=="/android"&&p!=="/skills")return;`;
}

/**
 * AdCash pop (aclib.js + runPop), gated to marketing routes.
 * Dynamically inserted scripts are async, so runPop waits for onload.
 */
export const ADCASH_BOOT_SCRIPT = `(function(){
${pathAllowedJs()}
if (document.getElementById("aclib")) return;
var s = document.createElement("script");
s.id = "aclib";
s.type = "text/javascript";
s.src = ${JSON.stringify(ADCASH_LIB_SRC)};
s.onload = function () {
  if (window.aclib && window.aclib.runPop) {
    window.aclib.runPop({ zoneId: ${JSON.stringify(ADCASH_POP_ZONE_ID)} });
  }
};
(document.body || document.head).appendChild(s);
})()`;

export function loadAdcashPop() {
  if (typeof document === "undefined") return;
  if (!pathAllowsAdcash(location.pathname || "/")) return;
  if (document.getElementById("aclib")) return;

  const s = document.createElement("script");
  s.id = "aclib";
  s.type = "text/javascript";
  s.src = ADCASH_LIB_SRC;
  s.onload = () => {
    const aclib = (
      window as unknown as {
        aclib?: { runPop: (opts: { zoneId: string }) => void };
      }
    ).aclib;
    aclib?.runPop({ zoneId: ADCASH_POP_ZONE_ID });
  };
  (document.body || document.head).appendChild(s);
}
