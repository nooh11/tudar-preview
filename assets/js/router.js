/* تُدار العقارات — tudar.sa
   التنقل بين الصفحات (#home, #about ...) */
/* ---------- Router ---------- */
const app=document.getElementById("app");
const pages=["home","about","management","projects","brief","contact"];
const titles={home:"الرئيسية",about:"من نحن",projects:"مشاريعنا",management:"إدارة الأملاك",brief:"أخبرنا عن مشروعك",contact:"تواصل معنا"};
let cur=null;
/* reading order: when a visitor reaches the end of a page, the next one is offered (and opens if they keep scrolling) */
const nextOf=n=>pages[(pages.indexOf(n)+1)%pages.length];
const nextBlock=n=>{const x=nextOf(n);return `<section class="nextp"><div class="wrap"><a class="np" href="#${x}" data-go="${x}"><span class="np-k">${x==="home"?"العودة إلى":"الصفحة التالية"}</span><b>${titles[x]}</b><span class="np-ar" aria-hidden="true">←</span></a></div></section>`};
function paintRange(el){if(el&&el.type==="range")el.style.setProperty("--f",((el.value-el.min)/(el.max-el.min)*100)+"%")}
document.addEventListener("input",e=>paintRange(e.target));
function render(name,scroll){
  XP.killScroll();
  if(!pages.includes(name))name="home";
  cur=name;
  app.innerHTML=`<div class="page">${P[name]()}${nextBlock(name)}</div>`;
  document.querySelectorAll(".links a,.mobile a").forEach(a=>{if(a.dataset.go===name)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  paintLogos(app);
  if(name==="home")initMarquee();
  FX.page(app.firstElementChild);
  XP.scenes(app.firstElementChild);
  if(name==="projects")renderList("all");
  if(name==="management")initCalc();
  if(name==="brief")initForm();
  if(scroll){XP.top();const h1=app.querySelector("h1");if(h1){h1.tabIndex=-1;h1.focus({preventScroll:true})}}
  document.title=titles[name]+" · تُدار العقارات";
  closeMenu();
}
function toSec(sec){const el=sec&&document.getElementById(sec);if(el)requestAnimationFrame(()=>el.scrollIntoView({block:"start"}));return !!el}
function go(name,sec){                   /* real history entries so the back button works; sec = jump straight to a section */
  if(name===cur){if(!toSec(sec))window.scrollTo(0,0);return}
  try{history.pushState({p:name},"","#"+name)}catch(e){}
  render(name,true);
  toSec(sec);
}
window.addEventListener("popstate",()=>{const h=(location.hash||"").slice(1);if(pages.includes(h)||!h)render(h||"home",true)});
window.addEventListener("hashchange",()=>{const h=(location.hash||"").slice(1);if(pages.includes(h)&&h!==cur)render(h,true)});
(()=>{
  const hint=document.createElement("div");hint.className="np-hint";hint.setAttribute("aria-hidden","true");hint.innerHTML='<span>واصل التمرير للانتقال إلى <b></b></span><i></i>';document.body.appendChild(hint);
  const NEED=800;let pull=0,t=0,since=0;
  const atEnd=()=>innerHeight+scrollY>=document.documentElement.scrollHeight-4;
  const reset=()=>{pull=0;hint.classList.remove("on");hint.style.setProperty("--p",0)};
  let moved=-1e9;   /* right after opening the next page, leftover wheel momentum must not scroll it */
  window.addEventListener("scroll",()=>{if(performance.now()-moved<900){window.scrollTo(0,0);return}if(atEnd()){if(!since)since=performance.now()}else{since=0;reset()}},{passive:true});
  const push=d=>{
    if(document.body.style.overflow==="hidden"||!atEnd()){reset();return}
    if(d<=0){reset();return}
    if(!since)since=performance.now();
    if(performance.now()-since<450)return;            /* ignore the momentum that carried them to the end */
    pull+=d;hint.querySelector("b").textContent=titles[nextOf(cur)];hint.classList.add("on");hint.style.setProperty("--p",Math.min(1,pull/NEED));
    clearTimeout(t);t=setTimeout(reset,800);
    if(pull>=NEED){reset();since=0;moved=performance.now();go(nextOf(cur))}
  };
  window.addEventListener("wheel",e=>push(e.deltaY),{passive:true});
  let y0=null;
  window.addEventListener("touchstart",e=>{y0=e.touches[0].clientY},{passive:true});
  window.addEventListener("touchmove",e=>{if(y0==null)return;const y=e.touches[0].clientY;push((y0-y)*2.4);y0=y},{passive:true});
  window.addEventListener("touchend",()=>{y0=null},{passive:true});
})();
document.addEventListener("click",e=>{
  const g=e.target.closest("[data-go]");
  if(g){e.preventDefault();if(g.dataset.svc)window.PRESVC=g.dataset.svc;go(g.dataset.go,g.dataset.sec);if(window.PRESVC&&typeof preSvc==="function")preSvc();return}
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
