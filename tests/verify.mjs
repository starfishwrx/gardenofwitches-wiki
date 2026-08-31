import {readFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname,join,relative,resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const files=[];
async function walk(dir){for(const name of await readdir(dir)){const p=join(dir,name);const s=await stat(p);if(s.isDirectory()){if(!['node_modules','.git'].includes(name))await walk(p)}else files.push(p)}}
await walk(root);
const rel=files.map(f=>relative(root,f).replaceAll('\\','/'));
const indexable=['index.html','wiki.html','walkthrough.html','builds/garden-of-witches-best-build.html','builds/broken-scissors-sharpness-build.html','builds/magic-scissors-fireball-build.html','guides/getting-started.html','guides/rooms-and-map.html','guides/upgrades-reset.html','guides/weapons.html','guides/garden-of-witches-1-0-changes.html','guides/armory.html','guides/controls.html','guides/challenge-mode.html','sources.html','privacy.html'];
const core=['index.html','builds/garden-of-witches-best-build.html','builds/broken-scissors-sharpness-build.html','builds/magic-scissors-fireball-build.html','guides/weapons.html','guides/getting-started.html','guides/rooms-and-map.html','guides/upgrades-reset.html','walkthrough.html','guides/challenge-mode.html','guides/garden-of-witches-1-0-changes.html','guides/armory.html','guides/controls.html'];
const commercial=['index.html','builds/garden-of-witches-best-build.html','builds/broken-scissors-sharpness-build.html','builds/magic-scissors-fireball-build.html','guides/weapons.html'];
const supporting=core.filter(x=>!commercial.includes(x));
const expectedTitles={
 'index.html':'Garden of Witches Wiki | Builds, Weapons & Walkthrough',
 'builds/garden-of-witches-best-build.html':'Garden of Witches Best Build for Version 1.0',
 'builds/broken-scissors-sharpness-build.html':'Garden of Witches Broken Scissors Build: Sharpness',
 'builds/magic-scissors-fireball-build.html':'Garden of Witches Magic Scissors Build: Fireball',
 'guides/weapons.html':'Garden of Witches Weapons: All Scissors Compared',
 'guides/getting-started.html':'Garden of Witches Beginner Guide: First Run Tips',
 'guides/rooms-and-map.html':'Garden of Witches Map: Rooms, Rewards & Routes',
 'guides/upgrades-reset.html':'Garden of Witches Upgrades Reset? Progress Guide',
 'walkthrough.html':'Garden of Witches Chapter Walkthrough: 1.0 Story Route',
 'guides/challenge-mode.html':'Garden of Witches Challenge Mode Guide: Unlock & Enter',
 'guides/garden-of-witches-1-0-changes.html':'Garden of Witches 1.0 Update: Combat & Progression',
 'guides/armory.html':'Garden of Witches Armory Guide: Unlocks & Loadouts',
 'guides/controls.html':'Garden of Witches Controls: Keyboard, Mouse & Gamepad'
};
const required=[...indexable,'guides/build-record-card.html','404.html','robots.txt','sitemap.xml','llms.txt','site.webmanifest','assets/media/source-manifest.json'];
for(const f of required)if(!rel.includes(f))throw new Error(`missing ${f}`);
const publicRoute=f=>f==='index.html'?'/':`/${f.replace(/\.html$/,'')}`;
const sourceHtml=rel.filter(f=>f.endsWith('.html')&&!f.startsWith('dist/'));
const routeToFile=new Map(sourceHtml.map(f=>[publicRoute(f),f]));
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&#x27;',"'").replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&#39;',"'");
const textOnly=s=>decode(s.replace(/<script.*?<\/script>|<style.*?<\/style>/gs,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
const schemasByFile=new Map();
for(const f of files.filter(f=>f.endsWith('.html'))){
 const s=await readFile(f,'utf8');const r=relative(root,f).replaceAll('\\','/');
 for(const token of ['<title>','<meta name="description"','<link rel="canonical" href="https://www.gardenofwitches.shop/','<meta property="og:image"','application/ld+json'])if(!s.includes(token))throw new Error(`${token} missing: ${r}`);
 const schemas=[...s.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));schemasByFile.set(r,schemas);
 if(!r.startsWith('dist/')){const expected=`https://www.gardenofwitches.shop${publicRoute(r)}`;const canonical=s.match(/<link rel="canonical" href="([^"]+)">/)?.[1];const ogUrl=s.match(/<meta property="og:url" content="([^"]+)">/)?.[1];if(canonical!==expected)throw new Error(`canonical mismatch ${r}: ${canonical} != ${expected}`);if(ogUrl!==expected)throw new Error(`OG URL mismatch ${r}: ${ogUrl} != ${expected}`);if(JSON.stringify(schemas).includes('.html'))throw new Error(`schema URL contains .html: ${r}`)}
 for(const m of s.matchAll(/<img\s+[^>]*>/g)){const tag=m[0];if(!/\salt="[^"]*"/.test(tag))throw new Error(`image alt missing: ${r}`);if(!/\swidth="\d+"/.test(tag)||!/\sheight="\d+"/.test(tag))throw new Error(`image dimensions missing: ${r}`);const src=tag.match(/\ssrc="([^"]+)"/)?.[1];if(!src)throw new Error(`image src missing: ${r}`);if(!/^(https?:|\/)/.test(src)){const target=resolve(dirname(f),src);if(!rel.includes(relative(root,target).replaceAll('\\','/')))throw new Error(`local image missing: ${r} -> ${src}`)}}
 for(const m of s.matchAll(/<(?:source)[^>]*\ssrc="([^"]+)"/g)){const src=m[1];const target=resolve(dirname(f),src);if(!rel.includes(relative(root,target).replaceAll('\\','/')))throw new Error(`local media missing: ${r} -> ${src}`)}
 if(indexable.includes(r)&&s.includes('noindex'))throw new Error(`indexable page is noindex: ${r}`);
 for(const m of s.matchAll(/\shref="([^"]+)"/g)){const href=m[1];if(/^(https?:|mailto:|tel:|#|javascript:)/.test(href))continue;const clean=href.split(/[?#]/)[0];if(!clean)continue;if(clean.endsWith('.html'))throw new Error(`internal link is not clean: ${r} -> ${href}`);if(clean.startsWith('/')&&routeToFile.has(clean))continue;const target=clean.startsWith('/')?resolve(root,clean.slice(1)):resolve(dirname(f),clean);const tr=relative(root,target).replaceAll('\\','/');if(!rel.includes(tr))throw new Error(`internal link missing: ${r} -> ${href}`)}
}
for(const r of core){
 const s=await readFile(join(root,r),'utf8');
 const title=decode(s.match(/<title>(.*?)<\/title>/s)?.[1]||'');const desc=decode(s.match(/<meta name="description" content="([^"]*)">/)?.[1]||'');const og=decode(s.match(/<meta property="og:title" content="([^"]*)">/)?.[1]||'');
 if(title!==expectedTitles[r])throw new Error(`title mismatch ${r}: ${title}`);if(title.length<35||title.length>60)throw new Error(`title length ${r}: ${title.length}`);if(!title.startsWith('Garden of Witches'))throw new Error(`entity not first ${r}`);if((title.match(/Garden of Witches/g)||[]).length!==1)throw new Error(`duplicate brand ${r}`);
 if(desc.length<120||desc.length>160)throw new Error(`description length ${r}: ${desc.length}`);if(og!==title)throw new Error(`OG title mismatch ${r}`);
 const article=schemasByFile.get(r).find(x=>['Article','WebSite'].includes(x['@type']));if(!article||article.headline!==title)throw new Error(`schema headline mismatch ${r}`);
 for(const token of ['direct-answer','quick-answer','<table','class="faq"','source','related'])if(!s.toLowerCase().includes(token))throw new Error(`${token} missing: ${r}`);
 const localLinks=[...s.matchAll(/\shref="([^"]+)"/g)].map(x=>x[1]).filter(x=>!x.startsWith('http')&&!x.startsWith('#'));if(localLinks.length<2)throw new Error(`fewer than 2 internal links: ${r}`);
 const visible=[...s.matchAll(/<details><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/gs)].map(x=>[textOnly(x[1]),textOnly(x[2])]);const faq=schemasByFile.get(r).find(x=>x['@type']==='FAQPage');if(!faq||faq.mainEntity.length!==visible.length)throw new Error(`FAQ count mismatch ${r}`);for(let i=0;i<visible.length;i++){if(faq.mainEntity[i].name!==visible[i][0]||faq.mainEntity[i].acceptedAnswer.text!==visible[i][1])throw new Error(`FAQ content mismatch ${r} #${i+1}`)}
 const words=textOnly(s).match(/\b[\w’'-]+\b/g)?.length||0;const minimum=r==='index.html'?1350:commercial.includes(r)?1450:850;if(words<minimum)throw new Error(`word target ${r}: ${words} < ${minimum}`);
}
const siteText=(await Promise.all(indexable.map(f=>readFile(join(root,f),'utf8')))).join('\n').toLowerCase();
for(const forbidden of ['capture queue','3 attacks per second'])if(siteText.includes(forbidden))throw new Error(`unsupported public phrase remains: ${forbidden}`);
const homeHtml=await readFile(join(root,'index.html'),'utf8');
for(const token of ["window.GA_MEASUREMENT_ID='G-MQYLZVS5B1'","analytics_storage:'denied'",'class="analytics-consent"'])if(!homeHtml.includes(token))throw new Error(`consent-first analytics token missing: ${token}`);
if(homeHtml.includes('googletagmanager.com/gtag/js'))throw new Error('Google Analytics library must not load before consent');
if(homeHtml.includes('Build Record Card'))throw new Error('retired Build Record Card remains on home');
const sitemap=await readFile(join(root,'sitemap.xml'),'utf8');for(const f of indexable){const url=`https://www.gardenofwitches.shop${publicRoute(f)}`;if(!sitemap.includes(`<loc>${url}</loc>`))throw new Error(`sitemap missing ${url}`)}if(sitemap.includes('.html'))throw new Error('sitemap contains redirected .html URLs');if(sitemap.includes('build-record-card'))throw new Error('retired page remains in sitemap');
const llms=await readFile(join(root,'llms.txt'),'utf8');for(const term of ['Broken Scissors Sharpness','Magic Scissors + Fireball','Attribute, Synergy and Rune','Challenge Mode','Chapters 1–5'])if(!llms.includes(term))throw new Error(`llms.txt missing ${term}`);
const server=await readFile(join(root,'server.mjs'),'utf8');for(const mime of ["'.jpg':'image/jpeg'","'.avif':'image/avif'","'.mp4':'video/mp4'"])if(!server.includes(mime))throw new Error(`server MIME missing ${mime}`);
const manifest=JSON.parse(await readFile(join(root,'assets/media/source-manifest.json'),'utf8'));const mediaFiles=rel.filter(f=>f.startsWith('assets/media/')&&!f.endsWith('source-manifest.json'));if(manifest.items.length!==mediaFiles.length)throw new Error(`media manifest count ${manifest.items.length} != files ${mediaFiles.length}`);for(const item of manifest.items){if(!item.source_url.startsWith('https://'))throw new Error(`source URL missing for ${item.file}`);const data=await readFile(join(root,'assets/media',item.file));const hash=createHash('sha256').update(data).digest('hex');if(hash!==item.sha256)throw new Error(`media hash mismatch ${item.file}`)}
console.log(`PASS full-rebuild: ${indexable.length} indexable pages; ${core.length} core pages; titles/descriptions/schema/FAQ/internal-links/word-targets valid; ${manifest.items.length} media hashes valid; challenge_mode=indexable; retired_card=noindex`);
