// Render README.md into a standalone index.html for the GitHub Pages site.
// Usage: node scripts/build-index.mjs <output-dir>
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

const outDir = process.argv[2];
if (!outDir) {
  console.error("Usage: node scripts/build-index.mjs <output-dir>");
  process.exit(1);
}

const body = marked.parse(readFileSync("README.md", "utf8"));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BioCypher Workshop Slides</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6;
         max-width: 48rem; margin: 3rem auto; padding: 0 1rem; color: #1a1a1a; }
  a { color: #1565c0; }
  h1, h2 { line-height: 1.2; }
  hr { border: none; border-top: 1px solid #ddd; margin: 2rem 0; }
  code { background: #f3f3f3; padding: 0.1em 0.3em; border-radius: 3px; }
</style>
</head>
<body>
${body}
</body>
</html>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), html);
console.log(`Wrote ${join(outDir, "index.html")}`);
