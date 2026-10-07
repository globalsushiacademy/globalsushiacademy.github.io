/**
 * Fails the build if any image in dist/ exceeds the weight budget.
 */
import { readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const MAX_BYTES = 300 * 1024;
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const offenders = [];
for await (const file of walk('dist')) {
  if (!IMAGE_EXT.has(extname(file).toLowerCase())) continue;
  const { size } = await stat(file);
  if (size > MAX_BYTES) offenders.push({ file, size });
}

if (offenders.length > 0) {
  console.error(`\n✗ ${offenders.length} image(s) over ${MAX_BYTES / 1024}KB:\n`);
  for (const { file, size } of offenders) {
    console.error(`  ${(size / 1024).toFixed(0).padStart(6)}KB  ${file}`);
  }
  console.error('\nResize the source in src/assets/, or let astro:assets emit smaller variants.\n');
  process.exit(1);
}
console.log('✓ image weight budget OK');
