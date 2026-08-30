# Garden of Witches Wiki project rules

## Source of truth

- Edit `scripts/generate.py` for page content and shared layout.
- Run `python3 scripts/generate.py` after every content change.
- Generated HTML is checked in for static hosting, but do not make a generated page the only copy of a change.
- Keep `sitemap.xml`, `llms.txt`, `robots.txt` and tests aligned with every indexable page.

## Player-first content

- The primary reader is opening Garden of Witches for the first time.
- Start with the visible symptom, answer it directly and end with one next action.
- Prefer task-specific pages over encyclopedia stubs.
- Do not invent exact mechanics, unlock conditions, room probabilities or balance numbers.
- Current 1.0 tooltips override pre-launch examples. Time-sensitive bug guidance must state its check date and link to the current official discussion.

## Commercial boundary

- Search traffic comes from a new-term window; trust and successful player outcomes come before ad density.
- Do not place ads ahead of the direct answer or first actionable checklist.
- Before enabling analytics or ads, update privacy disclosure and add consent handling where required.

## Verification

```bash
python3 scripts/generate.py
npm test
npm run serve
```

Use a real browser to check the homepage, changed pages, a 390px mobile viewport and the mobile menu. Store temporary browser artifacts under `output/playwright/`.
