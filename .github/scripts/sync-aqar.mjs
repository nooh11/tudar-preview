// تُدار العقارات — قراءة إعلانات المعلن من تطبيق عقار وحفظها في data/listings.json
// يشغّلها GitHub كل ساعة (.github/workflows/sync-aqar.yml)
import fs from 'node:fs';
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
const raw = (await gql()) || (await html());
const ok = !!raw?.length;
fs.mkdirSync('data', {recursive: true});
if (ok) fs.writeFileSync('data/listings.json', JSON.stringify({updated: new Date().toISOString(), listings: raw.filter(a => a?.id && a.published !== false).map(map)}));
fs.writeFileSync('data/sync-status.json', JSON.stringify({at: new Date().toISOString(), ok, count: ok ? raw.length : 0, log}, null, 1));
console.log(log.join('\n'), '\nok:', ok, raw?.length);
