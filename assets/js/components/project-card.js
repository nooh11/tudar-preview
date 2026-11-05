/* تُدار العقارات — tudar.sa
   بطاقة المشروع، شريط التوفر، ونافذة تفاصيل المشروع */
const avTotal=p=>p.av.a+p.av.r+p.av.s;
const avBar=(p,big)=>{const T=avTotal(p);const seg=(v,c,l)=>v?`<i class="av-${c}" style="flex:${v}" title="${l}: ${v}"></i>`:"";
  return `<div class="avb${big?' big':''}" role="img" aria-label="التوفر: ${p.av.a} متاحة، ${p.av.r} محجوزة، ${p.av.s} مباعة من ${T} وحدة"><div class="avb-bar" aria-hidden="true">${seg(p.av.s,"s","مباعة")}${seg(p.av.r,"r","محجوزة")}${seg(p.av.a,"a","متاحة")}</div><div class="avb-l" aria-hidden="true"><span><i class="av-a"></i>متاحة <b class="num">${p.av.a}</b></span><span><i class="av-r"></i>محجوزة <b class="num">${p.av.r}</b></span><span><i class="av-s"></i>مباعة <b class="num">${p.av.s}</b></span></div></div>`};
function projCard(p){
  const sold=Math.round((p.av.r+p.av.s)/avTotal(p)*100);
  return `<button class="card pcard" data-proj="${p.id}" aria-label="تفاصيل مشروع ${p.t}"><div class="ph">${facade(p.seed,p.kind)}<span class="badge">${p.av.a?"متاح":"مكتمل"}</span><span class="pen en" aria-hidden="true">${p.en}</span></div><div class="bd"><h3>${p.t}</h3><div class="loc">${pin}${p.city} · ${p.hood.split("،")[0]}</div><div class="price"><small>يبدأ من</small><b>${fmt(p.from)}</b><small>ريال</small></div>${avBar(p)}<div class="specs"><span><b class="num">${p.models.length}</b> ${p.kind==="building"?"أدوار":"نماذج"}</span><span><b class="num">${sold}%</b> مباع أو محجوز</span></div></div></button>`;
}
function openProject(id,opener){
  const p=PR.find(x=>x.id===id);if(!p)return;
  const priced=p.models.filter(m=>m.price);
  const m=document.createElement("div");m.className="modal";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-labelledby","pjT");
  m.innerHTML=`<div class="sheet pj"><div class="ph" style="position:relative">${facade(p.seed,p.kind,true)}<span class="badge">${p.av.a?"متاح":"مكتمل"}</span></div><div class="bd">
   <button class="x" aria-label="إغلاق">×</button>
   <span class="eyebrow">سكني · ${p.city}</span>
   <h3 id="pjT" style="font-size:32px">${p.t} <span class="en" style="font-size:16px;color:var(--muted);font-weight:500">${p.en}</span></h3>
   <div class="loc">${pin}${p.hood}</div>
   <p style="color:var(--muted)">${p.about}</p>
   <h4 class="pj-h">${p.kind==="building"?"الأدوار":"نماذج المشروع"}</h4>
   <div class="mdl" role="list">${p.models.map(x=>`<div role="listitem" class="${x.price?'':'off'}"><b class="en">${x.n}</b><span>${x.lbl?x.lbl+" · ":""}${x.st}</span>${x.land?`<small>أرض <b class="num">${x.land}</b> م² · بناء <b class="num">${x.built}</b> م²</small>`:""}<em>${x.price?`<b class="num">${fmt(x.price)}</b> ريال`:"—"}</em></div>`).join("")}</div>
   <h4 class="pj-h">التوفر</h4>${avBar(p,true)}
   <h4 class="pj-h">المزايا</h4><div class="tags">${p.feat.map(f=>`<span>${f}</span>`).join("")}</div>
   <h4 class="pj-h">المرافق</h4><div class="tags soft">${p.rooms.map(f=>`<span>${f}</span>`).join("")}</div>
   ${p.near.length?`<h4 class="pj-h">على بُعد</h4><div class="near">${p.near.map(([a,b])=>`<div><span>${a}</span><b>${b}</b></div>`).join("")}</div>`:""}
   ${priced.length?`<h4 class="pj-h">حاسبة التمويل</h4><div class="fin">
     <div class="in"><label for="fM">النموذج</label><select id="fM">${priced.map(x=>`<option value="${x.price}">${x.n}${x.lbl?" · "+x.lbl:""} · ${fmt(x.price)} ريال</option>`).join("")}</select></div>
     <div class="fld"><label for="fD">الدفعة الأولى <b id="fDv"></b></label><input type="range" id="fD" min="10" max="50" step="5" value="10"></div>
     <div class="fld"><label for="fY">مدة التمويل <b id="fYv"></b></label><input type="range" id="fY" min="5" max="25" value="25"></div>
     <div class="fin-out"><span>القسط الشهري التقديري</span><b class="num" id="fOut">—</b><small>بافتراض نسبة سنوية 5%. تقدير توضيحي، والقسط الفعلي تحدده جهة التمويل.</small></div>
   </div>`:""}
   <a class="btn btn-o" href="#brief" data-go="brief" style="justify-self:start">سجّل اهتمامك <span class="arr">←</span></a>
  </div></div>`;
  mountModal(m,opener);
  if(priced.length){const M=m.querySelector("#fM"),D=m.querySelector("#fD"),Y=m.querySelector("#fY");
    const up=()=>{const P0=+M.value*(1-D.value/100),r=.05/12,n=Y.value*12,pay=P0*r/(1-Math.pow(1+r,-n));m.querySelector("#fDv").textContent=D.value+"%";m.querySelector("#fYv").textContent=Y.value+" سنة";m.querySelector("#fOut").textContent=fmt(pay)+" ريال"};
    [M,D,Y].forEach(i=>i.addEventListener("input",up));up();}
}
function mountModal(m,opener){
  const bg=[app,document.querySelector("header.top"),document.querySelector("footer")];
  XP.lock(true);
  const close=()=>{XP.lock(false);m.remove();document.removeEventListener("keydown",key);bg.forEach(el=>el.inert=false);document.body.style.overflow="";if(opener&&document.contains(opener))opener.focus()};
  const key=ev=>{if(ev.key==="Escape")close();if(ev.key==="Tab"){const f=[...m.querySelectorAll("button,a[href],select,input")];const first=f[0],last=f[f.length-1];if(ev.shiftKey&&document.activeElement===first){ev.preventDefault();last.focus()}else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first.focus()}}};
  m.addEventListener("click",ev=>{if(ev.target===m||ev.target.closest(".x"))close();else if(ev.target.closest("[data-go]")){opener=null;close()}});
  document.addEventListener("keydown",key);
  document.body.appendChild(m);bg.forEach(el=>el.inert=true);document.body.style.overflow="hidden";m.querySelector(".x").focus();
  FX.modal(m.querySelector(".sheet"));
  m.querySelectorAll("input[type=range]").forEach(paintRange);
}
