/**
 * Fails the build if the output calls a third-party host.
 *
 * The site is designed to need no cookie banner. That only
 * holds while nothing loads from someone else's server before the visitor
 * consents. Self-hosted Google Fonts in particular is the single most
 * commonly abmahnt GDPR mistake on German sites.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const FORBIDDEN = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'google.com/maps/embed',
  'maps.googleapis.com',
  'googletagmanager.com',
  'google-analytics.com',
  'recaptcha',
  'connect.facebook.net',
  'platform.twitter.com',
  'youtube.com/embed',
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const hits = [];
for await (const file of walk('dist')) {
  if (!['.html', '.js', '.css'].includes(extname(file))) continue;
  const text = await readFile(file, 'utf8');
  for (const needle of FORBIDDEN) {
    if (text.includes(needle)) hits.push({ file, needle });
  }
}

if (hits.length > 0) {
  console.error('\n✗ third-party requests found — this would require a consent banner:\n');
  for (const { file, needle } of hits) console.error(`  ${needle}  in  ${file}`);
  console.error('\nSelf-host the asset, or load it behind explicit consent.\n');
  process.exit(1);
}
console.log('✓ no third-party embeds');
