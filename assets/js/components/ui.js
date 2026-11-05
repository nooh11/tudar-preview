/* تُدار العقارات — tudar.sa
   القائمة، التنبيهات، الشريط المتحرك، قائمة الوحدات */
function sel(btn){const b=btn.parentElement.querySelector("b");const r=document.createRange();r.selectNodeContents(b);const s=getSelection();s.removeAllRanges();s.addRange(r);toast("حدّدنا النص، انسخه يدويًا")}
function toast(t){document.querySelectorAll(".toast").forEach(x=>x.remove());const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
const menuT=document.getElementById("menuT"),mnav=document.getElementById("mobileNav");
function closeMenu(){mnav.classList.remove("open");menuT.setAttribute("aria-expanded","false")}
menuT.addEventListener("click",()=>{mnav.classList.toggle("open");menuT.setAttribute("aria-expanded",mnav.classList.contains("open"));if(mnav.classList.contains("open"))mnav.querySelector("a").focus()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&mnav.classList.contains("open")){closeMenu();menuT.focus()}});
function initMarquee(){
  const t=document.getElementById("mq"),b=document.getElementById("mqBtn");if(!t||!b)return;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const set=p=>{t.classList.toggle("paused",p);b.setAttribute("aria-pressed",p);b.setAttribute("aria-label",p?"تشغيل شريط الشركاء":"إيقاف شريط الشركاء");b.innerHTML=p?'<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M12 2v12L3 8z" fill="currentColor"/></svg>':'<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" fill="currentColor"/><rect x="9.5" y="2" width="3.5" height="12" fill="currentColor"/></svg>'};
  let paused=reduce;set(paused);
  b.addEventListener("click",()=>{paused=!paused;set(paused)});
  t.addEventListener("mouseenter",()=>t.classList.add("paused"));t.addEventListener("mouseleave",()=>t.classList.toggle("paused",paused));
}
function initTicker(){
  const t=document.getElementById("ticker"),b=document.getElementById("tickBtn");if(!t||!b)return;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const set=p=>{t.classList.toggle("paused",p);b.setAttribute("aria-pressed",p);b.setAttribute("aria-label",p?"تشغيل الشريط المتحرك":"إيقاف الشريط المتحرك");b.innerHTML=p?'<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M12 2v12L3 8z" fill="currentColor"/></svg>':'<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" fill="currentColor"/><rect x="9.5" y="2" width="3.5" height="12" fill="currentColor"/></svg>'};
  let paused=reduce;set(paused);
  b.addEventListener("click",()=>{paused=!paused;set(paused)});
  t.addEventListener("mouseenter",()=>t.classList.add("paused"));t.addEventListener("mouseleave",()=>t.classList.toggle("paused",paused));
  b.addEventListener("focus",()=>t.classList.add("paused"));b.addEventListener("blur",()=>t.classList.toggle("paused",paused));
}
const esc_=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function renderList(f){
  const el=document.getElementById("plist");if(!el)return;
  const items=PR.filter(x=>f==="all"||(f==="avail"?x.av.a>0:x.city===f));
  el.innerHTML=items.length?items.map(projCard).join(""):`<p style="color:var(--muted)">لا توجد مشاريع في هذا التصنيف حاليًا.</p>`;
  FX.cards(el.children);
}
function openDetail(id,opener){
  const x=L.find(i=>i.id===id);if(!x)return;
  const m=document.createElement("div");m.className="modal";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-labelledby","mdT");
  m.innerHTML=`<div class="sheet"><div class="ph" style="position:relative">${lsPhoto(x,true)}<span class="badge ${x.type==='rent'?'':'b'}">${x.type==="rent"?"للإيجار":"للبيع"}</span></div><div class="bd"><button class="x" aria-label="إغلاق">×</button><span class="eyebrow">${x.label} · ${x.city} · ${x.hood}</span><h3 id="mdT" style="font-size:28px;color:var(--burg)">${x.t}</h3><div class="price">${x.type==="sale"&&x.note.includes("بأسعار")?"<small>يبدأ من</small>":""}${lsPrice(x)}</div><div class="specs">${lsSpecs(x)}</div><p style="color:var(--muted)">${x.note}</p>${x.feat&&x.feat.length?`<div class="tags">${x.feat.map(f=>`<span>${f}</span>`).join("")}</div>`:""}<div class="ls-acts">${waForm("wafL","استفسر على واتساب")}<a class="btn btn-g" href="tel:+966534977299">اتصال</a><a class="ls-src" href="${x.url}" target="_blank" rel="noopener">الإعلان على تطبيق عقار ↗</a></div></div></div>`;
  waBind(m,()=>({kind:"عقار من مشاريعنا",prop:`${x.t} (${x.type==="rent"?"للإيجار":"للبيع"}) · ${x.hood}، ${x.city}`,details:`رقم الإعلان ${x.id} · https://sa.aqar.fm/ad/${x.id}`,msg:decodeURIComponent(lsWa(x).split("text=")[1]).replace(/^السلام عليكم،\s*/,"")}));
  mountModal(m,opener);
}
