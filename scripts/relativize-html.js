// Adds a <base href> tag to each exported HTML so relative assets (./_next/...) resolve
// correctly when opening files via file:// from any subdirectory.
// Usage: node scripts/relativize-html.js

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '..', 'out');

function listHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...listHtmlFiles(p));
    else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) files.push(p);
  }
  return files;
}

function computeBaseHref(filePath) {
  const rel = path.relative(OUT_DIR, path.dirname(filePath));
  if (!rel || rel === '.') return './';
  const segments = rel.split(path.sep).filter(Boolean);
  return '../'.repeat(segments.length);
}

function injectBase(html, baseHref) {
  // If there's already a <base>, replace it
  if (/<base\b[^>]*>/i.test(html)) {
    return html.replace(/<base\b[^>]*>/i, `<base href="${baseHref}">`);
  }
  // Insert right after <head>
  return html.replace(/<head(\s*[^>]*)>/i, (m) => `${m}\n    <base href="${baseHref}">`);
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error(`[relativize-html] Out dir not found: ${OUT_DIR}`);
    process.exit(0);
  }
  const files = listHtmlFiles(OUT_DIR);
  let updated = 0;
  for (const f of files) {
    try {
      const html = fs.readFileSync(f, 'utf8');
      const baseHref = computeBaseHref(f);
      const next = injectBase(html, baseHref);
      if (next !== html) {
        fs.writeFileSync(f, next, 'utf8');
        updated++;
      }
    } catch (e) {
      console.warn(`[relativize-html] Skipped ${f}:`, e.message);
    }
  }
  console.log(`[relativize-html] Updated ${updated} HTML files with <base href>.`);
}

main();


