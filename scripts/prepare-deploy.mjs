import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const dist = join(project, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const directory of ['assets', 'builds', 'guides']) {
  await cp(join(project, directory), join(dist, directory), { recursive: true });
}

const rootFiles = await readdir(project, { withFileTypes: true });
for (const entry of rootFiles) {
  if (!entry.isFile()) continue;
  if (entry.name.endsWith('.html') || ['llms.txt', 'robots.txt', 'sitemap.xml', 'site.webmanifest'].includes(entry.name)) {
    await cp(join(project, entry.name), join(dist, entry.name));
  }
}

console.log(`Prepared deploy directory: ${dist}`);
