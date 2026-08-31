# Deployment and search measurement

## Hosting choice

Use Cloudflare Pages Free for the first production release. The site is static, the free Pages limits are well above the current 1.8 MB build, custom domains and SSL are supported, and the project is intended to become commercial through advertising.

Netlify Free is the fallback because its current free plan explicitly supports commercial projects. Do not use Vercel Hobby for the advertising version: its free-plan commercial-use boundary does not fit this project. GitHub Pages is useful for documentation, but it is not the production host for this commercial SEO site.

## Build and deploy

```bash
npm test
npm run build
npx --yes wrangler@latest pages deploy dist --project-name gardenofwitches-wiki --branch main
```

`dist/` is rebuilt from scratch and contains only public HTML, assets, `robots.txt`, `sitemap.xml`, `llms.txt`, and the web manifest.

## Google Search Console

Prefer a Domain property for `gardenofwitches.shop`. Verify it with the TXT record supplied by Search Console so both apex and `www` variants are covered. Submit:

`https://www.gardenofwitches.shop/sitemap.xml`

The generator also accepts `GOOGLE_SITE_VERIFICATION` for URL-prefix meta verification when DNS verification is not available.

## Google Analytics

The GA4 web data stream for `https://www.gardenofwitches.shop` uses the public measurement ID `G-MQYLZVS5B1`, which is the generator default. Override it for a preview when needed:

```bash
GA_MEASUREMENT_ID=G-XXXXXXXXXX npm run build
```

The external Google Analytics library is not loaded until the visitor accepts the optional analytics prompt. Advertising storage remains disabled. Update the privacy and consent implementation before adding an advertising provider.

## Current external state

- Cloudflare Pages is live at `https://gardenofwitches-wiki.pages.dev`.
- `www.gardenofwitches.shop` points to Pages and serves the production site over HTTPS.
- The apex hostname uses a verified registrar-level permanent redirect to `https://www.gardenofwitches.shop`.
- The Search Console Domain property is verified by DNS TXT record; the sitemap was accepted with 16 discovered pages and the homepage has an indexing request.
- The GA4 property and web stream are created and linked to the Search Console Domain property; the production build uses consent-first loading.

## Canonical URL policy (2026-08-31)

- Publish and submit only extensionless URLs, for example `https://www.gardenofwitches.shop/guides/weapons`.
- Cloudflare Pages serves the checked-in `guides/weapons.html` file at that clean URL and redirects the `.html` request to it.
- Canonical, Open Graph URL, structured-data URL, internal links, `sitemap.xml`, and `llms.txt` must all use the same extensionless `www` URL.
- The registrar redirect for the apex domain must preserve the complete request path and query when forwarding to `www`. Verify a deep URL after every domain-forwarding change.
