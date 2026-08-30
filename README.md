# Garden of Witches Wiki

Demand-first static wiki for Garden of Witches 1.0 at `gardenofwitches.shop`. It targets the short SEO window around a newly rising game term, but pages are judged by whether a first-time player can complete the next task.

The source of truth is `scripts/generate.py`. Generated HTML, official media, SEO/GEO files and verification tests live in this directory. The keyword-discovery helper used for this project is cloned separately at `../findnewword`.

## Commands

```bash
python3 scripts/generate.py
npm test
npm run serve
npm run build
```

Open `http://127.0.0.1:4173` after starting the server.

`npm run build` creates a clean `dist/` directory containing only public site files. For a production analytics build, set `GA_MEASUREMENT_ID=G-...`; `GOOGLE_SITE_VERIFICATION=...` can add the Search Console HTML verification meta tag when URL-prefix verification is preferred. Domain-property DNS verification is preferred for the live custom domain.

## Current beginner path

- First-run checklist: `guides/getting-started.html`
- Map, room rewards and route choices: `guides/rooms-and-map.html`
- Upgrade reset and permanent progress: `guides/upgrades-reset.html`
- Controls, Armory, weapons, walkthrough and Challenge Mode follow from those pages.

## Editorial rule

Lead with a player question and a direct answer. Give one next action before background explanation. Label official 1.0 facts separately from pre-launch examples, older developer explanations and player tests. Keep media provenance in `assets/media/source-manifest.json`.
