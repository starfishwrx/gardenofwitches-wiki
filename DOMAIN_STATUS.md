# Domain status

- Domain: `gardenofwitches.shop`
- Registrar: Spaceship
- State: purchased (confirmed by the user on 2026-08-29)
- Availability-check price: `$0.70` first year + `$0.20` ICANN fee
- Availability-check renewal: `$31.05/year`
- Selected host: Cloudflare Pages Free (commercial static site, direct upload)
- Pages project: `gardenofwitches-wiki`
- Production deployment: `https://38ae2e8f.gardenofwitches-wiki.pages.dev`
- Stable Pages hostname: `https://gardenofwitches-wiki.pages.dev`
- Cloudflare custom-domain association: created for `gardenofwitches.shop` and `www.gardenofwitches.shop`; awaiting DNS validation
- Authoritative DNS: Spaceship (`launch1.spaceship.net`, `launch2.spaceship.net`)
- DNS: still points to the registrar parking address; Pages records are not active yet
- Site canonical base: `https://gardenofwitches.shop/`

The next external change is to replace the parking record in Spaceship Advanced DNS with Pages targets. Spaceship supports an apex CNAME as an ALIAS; both `@` and `www` should target `gardenofwitches-wiki.pages.dev` after confirming there are no conflicting records.
