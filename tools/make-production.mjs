// تُدار العقارات — تجهيز نسخة الإنتاج من نسخة المعاينة، مع فحص قبل الرفع.
//
// التشغيل (من جذر المستودع):  node tools/make-production.mjs dist
//   ينسخ ملفات الموقع إلى مجلد dist (أو أي مجلد تمرّره)، ثم:
//   - يحذف سطر <meta name="robots" content="noindex,..."> الخاص بالمعاينة من كل الصفحات (عدا 404).
//   - يضع robots.production.txt مكان robots.txt.
//   - يستبعد ملفات المعاينة والأدوات: .git و.github وtools و_templates وREADME.md و.nojekyll وdata/sync-status.json.
// ثم يفحص النسخة، ويتوقف برمز خطأ 1 إن وجد:
//   - noindex في أي صفحة منشورة، أو robots.txt يمنع الموقع كله.
//   - صفحة بلا title أو description أو canonical، أو بعدد H1 غير 1.
// ويطبع تنبيهًا بالقيم الناقصة مثل {{GTM_ID}} و{{CR_NUMBER}} (لا يتوقف عليها).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.resolve(process.argv[2] || 'dist');
const SKIP = new Set(['.git', '.github', 'tools', '_templates', 'README.md', '.nojekyll', 'robots.production.txt', 'node_modules', path.basename(OUT)]);
const SKIP_FILES = new Set(['data/sync-status.json']);

fs.rmSync(OUT, {recursive: true, force: true});
function copy(dir) {
  for (const name of fs.readdirSync(path.join(ROOT, dir))) {
    const rel = path.join(dir, name);
    if (!dir && SKIP.has(name)) continue;
    if (SKIP_FILES.has(rel) || name === '.DS_Store' || name.endsWith('.tmp')) continue;
    const src = path.join(ROOT, rel), dst = path.join(OUT, rel);
    if (fs.statSync(src).isDirectory()) { fs.mkdirSync(dst, {recursive: true}); copy(rel); }
    else fs.copyFileSync(src, dst);
  }
}
fs.mkdirSync(OUT, {recursive: true});
copy('');
fs.copyFileSync(path.join(ROOT, 'robots.production.txt'), path.join(OUT, 'robots.txt'));

const errors = [], todos = new Set();
const htmls = [];
(function walk(dir) { for (const n of fs.readdirSync(dir)) { const p = path.join(dir, n); if (fs.statSync(p).isDirectory()) walk(p); else if (n.endsWith('.html')) htmls.push(p); } })(OUT);
for (const f of htmls) {
  const rel = path.relative(OUT, f);
  let h = fs.readFileSync(f, 'utf8');
  if (rel !== '404.html') {
    h = h.replace(/<meta name="robots" content="noindex[^"]*">(<!--[^>]*-->)?\n?/g, '');
    fs.writeFileSync(f, h);
    if (/noindex/i.test(h)) errors.push(`${rel}: ما زال فيها noindex`);
    if (!/<title>[^<]+<\/title>/.test(h)) errors.push(`${rel}: بلا title`);
    if (!/<meta name="description" content="[^"]+">/.test(h)) errors.push(`${rel}: بلا description`);
    if (!/<link rel="canonical" href="https:\/\/tudar\.sa[^"]*">/.test(h)) errors.push(`${rel}: بلا canonical`);
    const h1 = (h.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) errors.push(`${rel}: عدد H1 = ${h1}`);
  }
  for (const m of h.matchAll(/\{\{[A-Z_]+\}\}/g)) todos.add(m[0]);
}
const robots = fs.readFileSync(path.join(OUT, 'robots.txt'), 'utf8');
if (/^Disallow:\s*\/\s*$/m.test(robots)) errors.push('robots.txt يمنع الموقع كله');

console.log(`نسخة الإنتاج في: ${OUT} (${htmls.length} صفحة)`);
if (todos.size) console.log('تنبيه، قيم ناقصة: ' + [...todos].join(' '));
if (errors.length) { console.error('لا ترفع هذه النسخة:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log('الفحص سليم: لا noindex، وكل صفحة فيها title وdescription وcanonical وH1 واحد.');
