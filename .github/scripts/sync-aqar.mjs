// تُدار العقارات — تحديث العقارات في صفحات الموقع (من ورقة «العروض» في جدول قوقل، أو من تطبيق عقار)
//
// التشغيل:  node sync-aqar.mjs [مجلد الموقع]
//   بدون مجلد: يستخدم المجلد الحالي (في GitHub: جذر المستودع، وتشغّله المهمة .github/workflows/sync-aqar.yml).
//   على سيرفر: مرّر مجلد الموقع المنشور، مثل:  node sync-aqar.mjs /var/www/tudar.sa   (Node.js 18+، بلا مكتبات)
//
// ماذا يكتب داخل مجلد الموقع:
//   data/listings.json           العقارات بصيغة JSON (يقرأها جدول قوقل أيضًا)
//   data/listings.js             نفس العقارات للمتصفح (const L=[...])
//   data/sync-status.json        نتيجة آخر تشغيل
//   index.html                   بطاقات أول 3 عقارات، وعدد العروض والمدن
//   real-estate-marketing.html   بطاقات أول 3 عقارات
//   projects.html                كل البطاقات، وأزرار التصفية، والأعداد، وبيانات العقارات لمحركات البحث (JSON-LD)
//   *.html                       رقم نسخة ملف العقارات (data/listings.js?v=...)
//   sitemap.xml                  تاريخ آخر تحديث للصفحات الثلاث
// الأجزاء التي يكتبها محصورة بين تعليقات مثل <!--LISTINGS-ALL--> و<!--/LISTINGS-ALL-->، فلا تحذف هذه التعليقات.
// البطاقات تُبنى بنفس كود الموقع (assets/js/components/cards.js)، فأي تعديل على شكل البطاقة يظهر هنا تلقائيًا.
// إن فشلت القراءة من عقار: يبقى كل شيء على آخر نسخة ناجحة، ويخرج السكربت برمز خطأ 1.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {execSync} from 'node:child_process';
const SITE = path.resolve(process.argv[2] || '.');

// ===== مصدر العقارات =====
// 'sheet': ورقة «العروض» في جدول قوقل، وتُحدَّث يدويًا (الوضع الحالي: تطبيق عقار يرفض القراءة الآلية من نوفمبر 2026).
// 'aqar' : تطبيق عقار مباشرة. للرجوع له: غيّر القيمة هنا إلى 'aqar'.
const SOURCE = process.env.LISTINGS_SOURCE || 'sheet';
// رابط جدول قوقل (نفس LEAD_URL في assets/js/core/leads.js) ويرجع العقارات الظاهرة في ورقة «العروض»
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxeeGfi3iBwic2Rm7YyoqgGYTMo-ZGVj5OpI7cyf8p3vNxee1n2nw62LUBmywOFFaDycg/exec?listings=1';
const USER_ID = 298306, PROFILE = `https://sa.aqar.fm/user/${USER_ID}`;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const Q = 'query findListings($size:Int $from:Int $where:WhereInput){Web{find(size:$size from:$from where:$where){total listings{id title path category city district imgs price rent_period area beds wc livings content address published}}}}';
const log = [];

async function gql() {
  for (const url of ['https://sa.aqar.fm/graphql', 'https://api.aqar.fm/graphql']) {
    try {
      const r = await fetch(url, {method: 'POST', headers: {'content-type': 'application/json', 'user-agent': UA, origin: 'https://sa.aqar.fm', referer: PROFILE, 'accept-language': 'ar'},
        body: JSON.stringify({operationName: 'findListings', query: Q, variables: {size: 100, from: 0, where: {user_id: {eq: USER_ID}}}})});
      const t = await r.text(); log.push(`GraphQL ${url} → ${r.status}`);
      if (!r.ok) continue;
      const a = JSON.parse(t)?.data?.Web?.find?.listings;
      if (a?.length) return a;
    } catch (e) { log.push(`GraphQL ${url} error ${e.message}`); }
  }
  return null;
}
async function html() {
  try {
    const r = await fetch(PROFILE, {headers: {'user-agent': UA, 'accept-language': 'ar'}});
    const h = await r.text(); log.push(`profile → ${r.status} · ${h.length}`);
    if (!r.ok) return null;
    let big = ''; for (const m of h.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g)) { try { big += JSON.parse('"' + m[1] + '"'); } catch {} }
    const k = '"initialListings":', i = big.indexOf(k); if (i < 0) return null;
    let d = 0, s = false, j = i + k.length;
    for (; j < big.length; j++) { const c = big[j]; if (s) { if (c === '\\') j++; else if (c === '"') s = false; continue; } if (c === '"') s = true; else if (c === '[' || c === '{') d++; else if (c === ']' || c === '}') { d--; if (!d) break; } }
    return JSON.parse(big.slice(i + k.length, j + 1));
  } catch (e) { log.push(`profile error ${e.message}`); return null; }
}
async function sheet() {
  try {
    const r = await fetch(SHEET_URL + '&t=' + Date.now(), {redirect: 'follow'});
    const t = await r.text(); log.push(`sheet → ${r.status}`);
    if (!r.ok) return [];
    const arr = JSON.parse(t)?.listings || [];
    return arr.filter(x => x && x.id && x.price).map(x => ({...x, id: Number(x.id), top: x.top === true,
      kind: x.kind || (/فيلا|استراحة|دوبلكس|شاليه/.test(x.label) ? 'villa' : /أرض/.test(x.label) ? 'land' : 'building'),
      url: x.url || 'https://sa.aqar.fm/ad/' + x.id}));
  } catch (e) { log.push(`sheet error ${e.message}`); return []; }
}
function map(a) {
  const title = String(a.title || ''), mm = title.match(/^(.+?)\s+لل(بيع|إيجار)/);
  const label = mm ? mm[1] : 'عقار', type = (mm && mm[2] === 'إيجار') || a.rent_period ? 'rent' : 'sale', hood = a.district || '';
  let note = String(a.content || '').replace(/\(\(الرقم يظهر عند الضغط على اتصال\)\)/g, '').replace(/[^؀-ۿ -~\n]/g, ' ').replace(/[#*_|]/g, ' ').replace(/\s+/g, ' ').trim();
  if (note.length > 220) note = note.slice(0, 220).replace(/\s+\S*$/, '') + '…';
  return {id: a.id, type, label, t: label + (hood ? ' في ' + hood : ''), city: a.city || '', hood,
    kind: /فيلا|استراحة|دوبلكس|شاليه/.test(label) ? 'villa' : /أرض/.test(label) ? 'land' : 'building',
    price: Math.round(Number(a.price) || 0), area: Number(a.area) || 0, beds: Number(a.beds) || 0, baths: Number(a.wc) || 0,
    img: a.imgs?.length ? 'https://images.aqar.fm/webp/750x0/props/' + a.imgs[0] : '', note, url: 'https://sa.aqar.fm/ad/' + a.id};
}

let list;
if (SOURCE === 'sheet') list = await sheet();
else { const raw = (await gql()) || (await html()); list = (raw || []).filter(a => a?.id && a.published !== false).map(map); }
log.push(`source: ${SOURCE} · ${list.length}`);
const ok = list.length > 0;
const now = new Date().toISOString();
const save = (rel, data) => { const f = path.join(SITE, rel), tmp = f + '.tmp'; fs.mkdirSync(path.dirname(f), {recursive: true}); fs.writeFileSync(tmp, data); fs.renameSync(tmp, f); };

if (ok) {
  if (!list.some(x => x.top)) list.slice(0, 3).forEach(x => { x.top = true; });   // 3 عقارات للرئيسية: المعلَّمة «مميز»، وإلا أول 3
  save('data/listings.json', JSON.stringify({updated: now, listings: list}));
  save('data/listings.js', 'const L=' + JSON.stringify(list) + ';\n');

  // نبني البطاقات بنفس كود الموقع
  const noop = () => {};
  const ctx = {Math, JSON, URL, encodeURIComponent, decodeURIComponent, setTimeout: noop, matchMedia: () => ({matches: false}),
    location: {href: 'https://tudar.sa/', search: ''}, document: {addEventListener: noop, getElementById: () => null, querySelectorAll: () => [], querySelector: () => null}};
  ctx.window = ctx; vm.createContext(ctx);
  const js = rel => vm.runInContext(fs.readFileSync(path.join(SITE, 'assets/js', rel), 'utf8'), ctx, {filename: rel});
  js('core/brand.js'); js('core/facade.js');
  vm.runInContext('const L=' + JSON.stringify(list) + ';', ctx);
  js('data/live-listings.js'); js('components/calculator.js'); js('components/cards.js');
  const card = vm.runInContext('cardHTML', ctx), chips = vm.runInContext('lfChips', ctx)();
  const top3 = list.filter(x => x.top).slice(0, 3).map(card).join('');
  const cities = new Set(list.map(x => x.city)).size, sale = list.filter(x => x.type === 'sale').length, rent = list.length - sale;
  const ld = {'@context': 'https://schema.org', '@type': 'ItemList', name: 'عقارات للبيع والإيجار تسوّقها تُدار العقارات', numberOfItems: list.length,
    itemListElement: list.map((x, i) => ({'@type': 'ListItem', position: i + 1, item: {'@type': 'RealEstateListing', name: x.t, url: x.url, ...(x.img ? {image: x.img} : {}),
      description: `${x.label} ${x.type === 'rent' ? 'للإيجار' : 'للبيع'} في ${x.hood}، ${x.city}${x.area ? `، المساحة ${x.area} م²` : ''}`,
      offers: {'@type': 'Offer', price: x.price, priceCurrency: 'SAR', businessFunction: x.type === 'rent' ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell'}}}))};
  const block = (h, key, inner) => {
    const re = new RegExp(`(<!--${key}-->)[\\s\\S]*?(<!--/${key}-->)`);
    if (!re.test(h)) { log.push(`لم أجد <!--${key}--> في الصفحة`); return h; }
    return h.replace(re, (m, a, b) => a + inner + b);
  };
  const count = (h, k, v) => h.replace(new RegExp(`(data-cnt="${k}"[^>]*>)\\d+(<)`, 'g'), `$1${v}$2`);
  const counts = h => count(count(count(count(h, 'ls', list.length), 'cities', cities), 'sale', sale), 'rent', rent);
  const v = Date.now().toString(36);
  const edit = (rel, fn) => { const f = path.join(SITE, rel); if (!fs.existsSync(f)) return; save(rel, fn(fs.readFileSync(f, 'utf8'))); };
  const pages = fs.readdirSync(SITE).filter(f => f.endsWith('.html'));
  for (const p of pages) edit(p, h => {
    h = h.replace(/data\/listings\.js\?v=\w+/g, 'data/listings.js?v=' + v);
    if (p === 'index.html') h = block(h, 'LISTINGS-HOME', top3);
    if (p === 'real-estate-marketing.html') h = block(h, 'LISTINGS-MKT', top3);
    if (p === 'projects.html') h = block(block(block(h, 'LISTINGS-ALL', list.map(card).join('')), 'LISTINGS-FILTERS', chips), 'LISTINGS-LD', `<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
    return counts(h);
  });
  edit('sitemap.xml', h => h.replace(/(<loc>https:\/\/tudar\.sa\/(?:projects|real-estate-marketing)?<\/loc>\s*<lastmod>)[^<]*/g, `$1${now.slice(0, 10)}`));
}
save('data/sync-status.json', JSON.stringify({at: now, ok, count: list.length, log}, null, 1));
// في GitHub: نجهّز الصفحات المعدّلة للحفظ، فتحفظها المهمة مع مجلد data
if (process.env.GITHUB_ACTIONS) { try { execSync('git add -A -- "*.html" sitemap.xml data', {cwd: SITE, stdio: 'inherit'}); } catch (e) { log.push('git add: ' + e.message); } }
console.log(log.join('\n'), '\nok:', ok, list.length, '→', SITE);
if (!ok) process.exit(1);
