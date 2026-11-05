/* تُدار العقارات — tudar.sa
   العروض المباشرة من تطبيق عقار عبر جدول قوقل (ورقة «العروض»، تتحدث كل ساعة).
   - إن نجح الجلب: تحل محل العروض الاحتياطية في data/rentals.js.
   - إن فشل: يبقى الموقع على العروض الاحتياطية، فلا تظهر الصفحة فاضية.
   - آخر نسخة تُحفظ في المتصفح 6 ساعات لفتح أسرع. */
const LISTINGS_URL=LEAD_URL?LEAD_URL+"?listings=1":"";
function applyListings(arr){
  if(!Array.isArray(arr)||!arr.length)return false;
  L.length=0;arr.forEach(x=>L.push(x));
  if(!L.some(x=>x.top))L.slice(0,3).forEach(x=>x.top=true);
  return true;
}
try{const c=JSON.parse(localStorage.getItem("tdr_ls")||"null");if(c&&Date.now()-c.t<6*36e5)applyListings(c.d)}catch(e){}
if(LISTINGS_URL){
  const ctl=typeof AbortController!=="undefined"?new AbortController():null;if(ctl)setTimeout(()=>ctl.abort(),8000);
  fetch(LISTINGS_URL,ctl?{signal:ctl.signal}:{}).then(r=>r.json()).then(j=>{
    if(!applyListings(j&&j.listings))return;
    try{localStorage.setItem("tdr_ls",JSON.stringify({t:Date.now(),d:j.listings}))}catch(e){}
    if(document.readyState==="loading")return;   /* الصفحة لم تُرسم بعد: سترسم بالعروض الجديدة */
    refreshListingsUI();
  }).catch(()=>{});
}
/* يحدّث العروض والأرقام في الصفحة المفتوحة بدون إعادة تحميلها */
function refreshListingsUI(){
  const cities=[...new Set(L.map(x=>x.city))];
  const set=(k,v)=>document.querySelectorAll(`[data-cnt="${k}"]`).forEach(e=>e.textContent=v);
  set("ls",L.length);set("cities",cities.length);set("sale",L.filter(x=>x.type==="sale").length);set("rent",L.filter(x=>x.type==="rent").length);
  const hg=document.getElementById("hlist");if(hg){hg.innerHTML=L.filter(x=>x.top).slice(0,3).map(cardHTML).join("");FX.cards(hg.children)}
  const ll=document.getElementById("llist");if(ll){ll.innerHTML=L.map(cardHTML).join("");FX.cards(ll.children)}
  const lf=document.getElementById("lfil");if(lf)lf.innerHTML=lfChips();
}
const lfChips=()=>`<button class="chip" data-lf="all" aria-pressed="true">الكل</button><button class="chip" data-lf="sale" aria-pressed="false">للبيع</button><button class="chip" data-lf="rent" aria-pressed="false">للإيجار</button>${[...new Set(L.map(x=>x.city))].map(c=>`<button class="chip" data-lf="${c}" aria-pressed="false">${c}</button>`).join("")}`;
