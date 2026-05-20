export const dynamic = "force-dynamic";

export function GET() {
  const script = `(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function normalize(value, fallback) {
    return value || fallback;
  }

  ready(function () {
    var scripts = document.querySelectorAll("script[data-target]");

    scripts.forEach(function (script) {
      var targetSelector = script.getAttribute("data-target");
      var target = targetSelector ? document.querySelector(targetSelector) : null;

      if (!target) {
        return;
      }

      var locale = normalize(script.getAttribute("data-locale"), "en");
      var theme = normalize(script.getAttribute("data-theme"), "light");
      var layout = normalize(script.getAttribute("data-layout"), "cards");
      var height = layout === "site" ? "820" : layout === "compact" ? "320" : "420";
      var scriptUrl = new URL(script.src, window.location.href);
      var endpoint = layout === "site" ? "/embed/site" : "/embed/cards";
      var src = scriptUrl.origin + endpoint + "?locale=" + encodeURIComponent(locale) +
        "&theme=" + encodeURIComponent(theme) +
        (layout === "site" ? "&view=index" : "&layout=" + encodeURIComponent(layout));
      var iframe = document.createElement("iframe");

      iframe.src = src;
      iframe.title = "UGA Index";
      iframe.loading = "lazy";
      iframe.style.width = "100%";
      iframe.style.maxWidth = "100%";
      iframe.style.height = height + "px";
      iframe.style.border = "0";
      iframe.style.display = "block";
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("allowfullscreen", "");

      target.innerHTML = "";
      target.appendChild(iframe);
    });
  });
})();`;

  return new Response(script, {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "application/javascript; charset=utf-8",
    },
  });
}
