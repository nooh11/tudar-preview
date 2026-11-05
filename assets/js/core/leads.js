/* تُدار العقارات — tudar.sa
   تسجيل العملاء في Google Sheets: «قاعدة عملاء تُدار العقارات» (ورقة «العملاء»)
   الجدول يحفظ فقط: الاسم، الجوال، نوع الطلب، العقار (إن كان الاستفسار عن عرض)، التفاصيل.
   أنواع الطلب: عقار من مشاريعنا / إدارة أملاك / تسويق عقاري / فحص وتطوير عقاري / استفسار عام
   الشرح الكامل: docs/google-sheets-setup.md */
const LEAD_URL="https://script.google.com/macros/s/AKfycbxeeGfi3iBwic2Rm7YyoqgGYTMo-ZGVj5OpI7cyf8p3vNxee1n2nw62LUBmywOFFaDycg/exec";
const WA_NUM="966534977299";
const KINDS=["استفسار عام","إدارة أملاك","تسويق عقاري","فحص وتطوير عقاري"];

/* يرسل سطرًا للجدول */
function lead(kind,name,phone,details,prop){
  if(!LEAD_URL)return false;
  /* الجوال بمسافات (059 173 4948) حتى يبقى نصًّا في الجدول ولا يضيع الصفر */
  const ph=(phone||"").replace(/^(\d{3})(\d{3})(\d{4})$/,"$1 $2 $3");
  const body=JSON.stringify({kind,name:name||"",phone:ph,prop:prop||"",details:(details||"").slice(0,600)});
  try{
    if(navigator.sendBeacon&&navigator.sendBeacon(LEAD_URL,new Blob([body],{type:"text/plain"})))return true;
    fetch(LEAD_URL,{method:"POST",mode:"no-cors",keepalive:true,headers:{"Content-Type":"text/plain"},body});return true;
  }catch(e){return false}
}
const normPhone=v=>v.replace(/[\s-]/g,"").replace(/^\+?966/,"0").replace(/^5/,"05");
const okPhone=v=>/^05\d{8}$/.test(v);
const openWa=t=>window.open(`https://wa.me/${WA_NUM}?text=`+encodeURIComponent(t),"_blank","noopener");

/* نموذج صغير قبل واتساب: الاسم (اختياري) والجوال. withKinds يضيف اختيار نوع الاستفسار */
const waForm=(id,label,withKinds)=>`<form class="waf" id="${id}" novalidate>${withKinds?`<div class="qch waf-k" role="radiogroup" aria-label="نوع الاستفسار">${KINDS.map((k,i)=>`<button type="button" role="radio" data-k="${k}" aria-checked="${i===0}">${k}</button>`).join("")}</div>`:""}<div class="waf-f"><input name="n" autocomplete="name" placeholder="اسمك (اختياري)" aria-label="الاسم"><input name="p" type="tel" inputmode="tel" autocomplete="tel-national" dir="ltr" class="en" placeholder="05xxxxxxxx" aria-label="رقم الجوال" required></div><span class="waf-e" hidden>اكتب رقم جوال صحيح يبدأ بـ 05</span><button class="btn btn-o" type="submit">${label}</button></form>`;
/* info() يرجع {kind, details, msg}: msg نص رسالة واتساب بعد التحية */
function waBind(root,info){
  const f=root.querySelector(".waf");if(!f)return;
  let kind=KINDS[0];
  f.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{kind=b.dataset.k;f.querySelectorAll("[data-k]").forEach(x=>x.setAttribute("aria-checked",x===b))}));
  f.addEventListener("submit",e=>{e.preventDefault();
    const n=f.n.value.trim(),ph=normPhone(f.p.value),ok=okPhone(ph);
    f.querySelector(".waf-e").hidden=ok;f.p.setAttribute("aria-invalid",!ok);if(!ok){f.p.focus();return}
    const d=info(kind);lead(d.kind,n,ph,d.details,d.prop);
    openWa(`السلام عليكم${n?"، أنا "+n:""}.\n${d.msg}\nجوالي: ${ph}`);
  });
}

/* زر الواتساب العائم وروابط الواتساب العامة (data-waq): نافذة صغيرة تسأل الاسم والجوال ونوع الاستفسار */
function waQuick(opener){
  const m=document.createElement("div");m.className="modal";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-labelledby","wqT");
  m.innerHTML=`<div class="sheet wq"><div class="bd"><button class="x" aria-label="إغلاق">×</button><h3 id="wqT" style="font-size:24px;color:var(--burg)">كلمنا على واتساب</h3><p style="color:var(--muted)">وش تبي تستفسر عنه؟ اكتب رقمك وتنفتح لك رسالة جاهزة.</p>${waForm("wafQ","افتح واتساب",true)}</div></div>`;
  waBind(m,k=>({kind:k,details:"",msg:`أبي أستفسر عن: ${k}.`}));
  mountModal(m,opener);
}
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-waq]");if(!a)return;
  e.preventDefault();waQuick(a);
});
