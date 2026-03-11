const fs = require('fs');
const path = require('path');

const env = {
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
};

const src = path.join(__dirname, 'index.html');
const destDir = path.join(__dirname, 'dist');
const dest = path.join(destDir, 'index.html');

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

// node_modules에서 supabase UMD 번들을 dist/에 복사 (CDN 대신 로컬 서빙)
const supabaseSrc = path.join(__dirname, 'node_modules/@supabase/supabase-js/dist/umd/supabase.js');
const supabaseDest = path.join(destDir, 'supabase.min.js');
if (fs.existsSync(supabaseSrc)) {
  fs.copyFileSync(supabaseSrc, supabaseDest);
  console.log('Supabase JS copied to dist/supabase.min.js');
} else {
  console.error('supabase UMD 파일을 찾을 수 없습니다:', supabaseSrc);
  process.exit(1);
}

let html = fs.readFileSync(src, 'utf8');
html = html.replace(/__SUPABASE_URL__/g, env.SUPABASE_URL);
html = html.replace(/__SUPABASE_ANON_KEY__/g, env.SUPABASE_ANON_KEY);

fs.writeFileSync(dest, html, 'utf8');
console.log('Build done. Supabase URL injected:', !!env.SUPABASE_URL);
