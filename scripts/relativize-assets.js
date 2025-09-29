// Rewrites absolute public asset URLs ("/assets/...", "/audio/...") to relative
// ones ("assets/...", "audio/...") inside the exported `out` directory.
// This makes the static build robust when opened from subfolders or via file://
// where leading slashes break.

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '..', 'out');

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...listFiles(p));
    else if (e.isFile()) files.push(p);
  }
  return files;
}

function shouldProcess(filePath) {
  // Restrict to text-like files we expect urls inside
  const ext = path.extname(filePath).toLowerCase();
  return ['.html', '.css', '.js', '.mjs', '.cjs'].includes(ext);
}

function rewrite(content, filePath) {
  let next = content;
  const ext = path.extname(filePath).toLowerCase();
  const isCss = ext === '.css';

  if (isCss) {
    // From out/_next/static/css/*.css to out/assets -> ../../../assets
    // Same for other public folders
    next = next.replace(/url\((\s*)["']?\/(assets|audio|fonts|icons)\//g, (m, ws, folder) => `url(${ws}../../../${folder}/`);
  } else {
    // HTML/JS: make them document-relative; base href handles page depth
    next = next.replace(/"\/(assets|audio|fonts|icons)\//g, '"$1/');
    next = next.replace(/'\/(assets|audio|fonts|icons)\//g, "'$1/");
    next = next.replace(/\(\s*\/(assets|audio|fonts|icons)\//g, '($1/');

    // Internal route anchors and serialized links: make them relative too
    // href="/xyz" -> href="xyz" (skipping _next and public folders)
    next = next.replace(/href=\"\/(?!_next|assets|audio|fonts|icons)([^\"#?]*)/g, 'href=\"$1');
    next = next.replace(/href='\/(?!_next|assets|audio|fonts|icons)([^'#?]*)/g, "href='$1");
    // "to":"/xyz" -> "to":"xyz"
    next = next.replace(/\"to\":\"\/(?!_next|assets|audio|fonts|icons)([^\"#?]*)/g, '\"to\":\"$1');
    // initialCanonicalUrl:"/xyz" -> initialCanonicalUrl:"xyz"
    next = next.replace(/initialCanonicalUrl\\\":\\\"\/(?!_next|assets|audio|fonts|icons)([^\\\"#?]*)/g, 'initialCanonicalUrl\\\":\\\"$1');
  }

  return next;
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error(`[relativize-assets] Out dir not found: ${OUT_DIR}`);
    process.exit(0);
  }

  const files = listFiles(OUT_DIR).filter(shouldProcess);
  let updated = 0;
  for (const f of files) {
    try {
      const buf = fs.readFileSync(f);
      const txt = buf.toString('utf8');
      const next = rewrite(txt, f);
      if (next !== txt) {
        fs.writeFileSync(f, next, 'utf8');
        updated++;
      }
    } catch (e) {
      console.warn(`[relativize-assets] Skipped ${f}:`, e.message);
    }
  }
  console.log(`[relativize-assets] Updated ${updated} files.`);
}

main();


