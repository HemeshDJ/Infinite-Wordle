const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const basePath = (process.env.GITHUB_PAGES_BASE_PATH || 'Infinite-Wordle')
  .replace(/^\/+|\/+$/g, '');

if (!basePath) {
  throw new Error('GITHUB_PAGES_BASE_PATH must not be empty.');
}

const prefix = `/${basePath}`;

function rewriteFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let updated = original;

  const replacements = [
    ['"/_expo/', `"${prefix}/_expo/`],
    ['"/favicon.ico"', `"${prefix}/favicon.ico"`],
    ["'/_expo/", `'${prefix}/_expo/`],
    ["'/favicon.ico'", `'${prefix}/favicon.ico'`],
    ['`/_expo/', `\`${prefix}/_expo/`],
  ];

  for (const [from, to] of replacements) {
    if (updated.includes(to)) {
      continue;
    }
    updated = updated.split(from).join(to);
  }

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
  }
}

function walk(currentPath) {
  for (const entry of fs.readdirSync(currentPath, { withFileTypes: true })) {
    const entryPath = path.join(currentPath, entry.name);

    if (entry.isDirectory()) {
      walk(entryPath);
      continue;
    }

    if (/\.(html|js|css)$/.test(entry.name)) {
      rewriteFile(entryPath);
    }
  }
}

walk(distDir);

const indexHtml = path.join(distDir, 'index.html');
const notFoundHtml = path.join(distDir, '404.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, notFoundHtml);
}
