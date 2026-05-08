# UGA Index Embeds

Embeds must use the public site URL from `NEXT_PUBLIC_SITE_URL`. Do not hardcode the deployment domain in templates or CMS snippets.

## Iframe Cards

```html
<iframe
  src="${NEXT_PUBLIC_SITE_URL}/embed/cards?locale=en&theme=light&layout=cards"
  title="UGA Index"
  loading="lazy"
  style="width: 100%; height: 420px; border: 0; display: block;"
></iframe>
```

Compact Ukrainian version:

```html
<iframe
  src="${NEXT_PUBLIC_SITE_URL}/embed/cards?locale=uk&theme=light&layout=compact"
  title="UGA Index"
  loading="lazy"
  style="width: 100%; height: 320px; border: 0; display: block;"
></iframe>
```

Supported query parameters:

- `locale=uk|en`
- `theme=light`
- `layout=cards|compact`

## Iframe Chart

```html
<iframe
  src="${NEXT_PUBLIC_SITE_URL}/embed/chart?commodity=corn&locale=uk"
  title="UGA Index corn chart"
  loading="lazy"
  style="width: 100%; height: 340px; border: 0; display: block;"
></iframe>
```

Supported commodities:

- `corn`
- `wheat-115`
- `feed-wheat`
- `gmo-soybean`

## JavaScript Loader

The loader injects the cards iframe into the element referenced by `data-target`.

```html
<div id="uga-index-widget"></div>
<script
  src="${NEXT_PUBLIC_SITE_URL}/embed/uga-index.js"
  data-target="#uga-index-widget"
  data-locale="en"
  data-theme="light"
  data-layout="cards"
></script>
```

Loader data attributes:

- `data-target`: CSS selector for the container element.
- `data-locale`: `uk` or `en`.
- `data-theme`: currently `light`.
- `data-layout`: `cards` or `compact`.

## WordPress Notes

For WordPress, paste the iframe snippet into a Custom HTML block. If script tags are restricted by the WordPress role or security plugin, use the iframe version.

## Frame Security

The demo sends a Content Security Policy for `/embed/*`. Allowed frame ancestors come from `ALLOWED_EMBED_ORIGINS`, for example:

```bash
ALLOWED_EMBED_ORIGINS="https://uga.ua https://www.uga.ua https://index.cr0pto.com http://localhost:* http://127.0.0.1:*"
```

Normal public site pages are not changed by the embed-specific frame policy.
