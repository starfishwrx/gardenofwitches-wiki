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

`https://gardenofwitches.shop/sitemap.xml`

The generator also accepts `GOOGLE_SITE_VERIFICATION` for URL-prefix meta verification when DNS verification is not available.

## Google Analytics

Create one GA4 web data stream for `https://gardenofwitches.shop`. Build with its public measurement ID:

```bash
GA_MEASUREMENT_ID=G-XXXXXXXXXX npm run build
```

The external Google Analytics library is not loaded until the visitor accepts the optional analytics prompt. Advertising storage remains disabled. Update the privacy and consent implementation before adding an advertising provider.

## Current external blockers

- Cloudflare Pages is live at `https://gardenofwitches-wiki.pages.dev`.
- Cloudflare custom-domain associations exist for the apex and `www` hostnames, but DNS validation is pending.
- The domain still uses Spaceship DNS and its parking record has not been replaced with the Pages targets.
- Search Console and GA4 properties require the user's Google account session.
