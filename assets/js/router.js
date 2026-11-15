/* تُدار العقارات — tudar.sa
   تشغيل الصفحة الحالية. كل صفحة ملف HTML مستقل (index.html، property-management.html ...)،
   واسم الصفحة الحالية في <body data-page="...">. الروابط بين الصفحات روابط عادية. */
const app=document.getElementById("app");
const SEQ=["home","property-management","real-estate-marketing","projects","calculator","about","free-inspection","contact"];
const titles={"home":"الرئيسية","property-management":"إدارة الأملاك","real-estate-marketing":"التسويق العقاري","projects":"مشاريعنا","calculator":"الحاسبة","about":"من نحن","free-inspection":"افحص عمارتك مجانًا","contact":"تواصل معنا"};
const pageUrl=n=>n==="home"?"./":n;
const cur=document.body.dataset.page||"";
const nextOf=n=>SEQ[(SEQ.indexOf(n)+1)%SEQ.length];
function paintRange(el){if(el&&el.type==="range")el.style.setProperty("--f",((el.value-el.min)/(el.max-el.min)*100)+"%")}
document.addEventListener("input",e=>paintRange(e.target));
/* تفعيل الحركات والأجزاء التفاعلية في الصفحة الحالية */
function initPage(){
  paintLogos(app);
  if(document.getElementById("mq"))initMarquee();
  if(app.firstElementChild){FX.page(app.firstElementChild);XP.scenes(app.firstElementChild)}
  if(cur==="projects")renderList("all");
  if(cur==="calculator")initCalc();
  if(cur==="free-inspection")initForm();
}
/* عند الوصول لآخر الصفحة ومواصلة التمرير: تُفتح الصفحة التالية */
if(SEQ.includes(cur))(()=>{
  const hint=document.createElement("div");hint.className="np-hint";hint.setAttribute("aria-hidden","true");hint.innerHTML='<span>واصل التمرير للانتقال إلى <b></b></span><i></i>';document.body.appendChild(hint);
  const NEED=800;let pull=0,t=0,since=0,gone=false;
  const atEnd=()=>innerHeight+scrollY>=document.documentElement.scrollHeight-4;
  const reset=()=>{pull=0;hint.classList.remove("on");hint.style.setProperty("--p",0)};
  window.addEventListener("scroll",()=>{if(atEnd()){if(!since)since=performance.now()}else{since=0;reset()}},{passive:true});
  const push=d=>{
    if(gone||document.body.style.overflow==="hidden"||!atEnd()){reset();return}
    if(d<=0){reset();return}
    if(!since)since=performance.now();
    if(performance.now()-since<450)return;            /* تجاهل اندفاع التمرير الذي أوصل الزائر لآخر الصفحة */
    pull+=d;hint.querySelector("b").textContent=titles[nextOf(cur)];hint.classList.add("on");hint.style.setProperty("--p",Math.min(1,pull/NEED));
    clearTimeout(t);t=setTimeout(reset,800);
    if(pull>=NEED){reset();gone=true;location.href=pageUrl(nextOf(cur))}
  };
  window.addEventListener("wheel",e=>push(e.deltaY),{passive:true});
  let y0=null;
  window.addEventListener("touchstart",e=>{y0=e.touches[0].clientY},{passive:true});
  window.addEventListener("touchmove",e=>{if(y0==null)return;const y=e.touches[0].clientY;push((y0-y)*2.4);y0=y},{passive:true});
  window.addEventListener("touchend",()=>{y0=null},{passive:true});
  window.addEventListener("pageshow",()=>{gone=false});
})();
document.addEventListener("click",e=>{
  const lf=e.target.closest("[data-lf]");
  if(lf){document.querySelectorAll("[data-lf]").forEach(c=>c.setAttribute("aria-pressed",c===lf));const v=lf.dataset.lf,el=document.getElementById("llist");
    if(el){el.innerHTML=L.filter(x=>v==="all"||x.type===v||x.city===v).map(cardHTML).join("");FX.cards(el.children)}return}
  const f=e.target.closest("[data-f]");
  if(f){document.querySelectorAll("[data-f]").forEach(c=>c.setAttribute("aria-pressed",c===f));renderList(f.dataset.f);return}
  const o=e.target.closest("[data-open]");
  if(o){openDetail(+o.dataset.open,o);return}
  const hs=e.target.closest(".hs");
  if(hs){const was=hs.getAttribute("aria-expanded")==="true";document.querySelectorAll(".hs").forEach(x=>x.setAttribute("aria-expanded","false"));hs.setAttribute("aria-expanded",String(!was));return}
  const pj=e.target.closest("[data-proj]");
  if(pj){openProject(pj.dataset.proj,pj);return}
  const cp=e.target.closest("[data-copy]");
  if(cp){const v=cp.dataset.copy;const ok=()=>toast("تم النسخ: "+v);try{navigator.clipboard.writeText(v).then(ok,()=>sel(cp))}catch(err){sel(cp)}return}
});
