const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const basePath = (process.env.GITHUB_PAGES_BASE_PATH || 'Infinite-Wordle')
  .replace(/^\/+|\/+$/g, '');

if (!basePath) {
  throw new Error('GITHUB_PAGES_BASE_PATH must not be empty.');
}

const replacements = [
  ['"/_expo/', `"/${basePath}/_expo/`],
  ['"/favicon.ico"', `"/${basePath}/favicon.ico"`],
  ["'/_expo/", `'/${basePath}/_expo/`],
  ["'/favicon.ico'", `'/${basePath}/favicon.ico'`],
  ['`/_expo/', `\`/${basePath}/_expo/`],
];

function rewriteFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let updated = original;

  for (const [from, to] of replacements) {
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
