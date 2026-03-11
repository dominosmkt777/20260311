const fs = require('fs');
const path = require('path');

const env = {
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
};

const src = path.join(__dirname, 'index.html');
const destDir = path.join(__dirname, 'dist');
const dest = path.join(destDir, 'index.html');

let html = fs.readFileSync(src, 'utf8');
html = html.replace(/__SUPABASE_URL__/g, env.SUPABASE_URL);
html = html.replace(/__SUPABASE_ANON_KEY__/g, env.SUPABASE_ANON_KEY);

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
fs.writeFileSync(dest, html, 'utf8');
console.log('Build done. Supabase URL injected:', !!env.SUPABASE_URL);
