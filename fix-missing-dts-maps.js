#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Walk node_modules and search for references to .d.ts.map files. If found and
// the referenced file is missing, create an empty placeholder so CI/builds
// that try to read them won't fail.

const root = path.resolve(__dirname, '..');
const nm = path.join(root, 'node_modules');

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, cb);
    } else if (e.isFile()) {
      cb(full);
    }
  }
}

function ensureFile(file) {
  try {
    if (!fs.existsSync(file)) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, '', 'utf8');
      console.log('created shim:', file);
    }
  } catch (err) {
    // ignore permission errors
  }
}

if (!fs.existsSync(nm)) {
  console.warn('no node_modules found, skipping fix-missing-dts-maps');
  process.exit(0);
}

const re = /sourceMappingURL\s*=\s*([^\s'"\n]+)/gi;
let created = 0;

walk(nm, (file) => {
  // Only examine text files likely to contain sourceMappingURL
  if (!/\.(js|mjs|cjs|ts|d\.ts|json|map)$/.test(file)) return;
  try {
    const txt = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = re.exec(txt))) {
      const ref = m[1].replace(/^["']|["']$/g, '');
      if (!ref.includes('.d.ts.map')) continue;
      let target;
      if (ref.startsWith('http') || ref.startsWith('//')) continue; // remote
      if (ref.startsWith('/')) {
        target = path.join(root, ref);
      } else {
        target = path.resolve(path.dirname(file), ref);
      }
      if (!fs.existsSync(target)) {
        ensureFile(target);
        created++;
      }
    }
  } catch (e) {
    // ignore binary files or read errors
  }
});

if (created === 0) console.log('fix-missing-dts-maps: no missing .d.ts.map files found');
else console.log('fix-missing-dts-maps: created', created, 'shim(s)');
