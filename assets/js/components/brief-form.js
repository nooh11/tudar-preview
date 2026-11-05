/* تُدار العقارات — tudar.sa
   نموذج «أخبرنا عن مشروعك» (يرسل الطلب إلى Google Sheets عبر core/leads.js، وإن لم يُضبط الرابط يكمل على واتساب) */
/* اختيار الخدمة مسبقًا عند القدوم من زر مثل «اطلب فحصًا مجانيًا» (data-svc="dev") */
function preSvc(){const m={pm:"svc1",mk:"svc2",dev:"svc3"}[window.PRESVC];const r=m&&document.getElementById(m);if(r){r.checked=true;window.PRESVC=null}}
function initForm(){
  preSvc();
  let step=0;const f=document.getElementById("bf");const steps=[...f.querySelectorAll("[data-step]")];
  const back=document.getElementById("back"),next=document.getElementById("next"),prog=[...document.querySelectorAll("#prog li")];
  const show=()=>{steps.forEach((s,i)=>s.hidden=i!==step);prog.forEach((p,i)=>{p.classList.toggle("on",i<=step);if(i===step)p.setAttribute("aria-current","step");else p.removeAttribute("aria-current")});back.hidden=step===0;next.innerHTML=step===2?"أرسل الطلب":"التالي <span class='arr'>←</span>"};
  back.onclick=()=>{step--;show();steps[step].querySelector("input,select")?.focus()};
  f.addEventListener("submit",e=>{e.preventDefault();
    if(step<2){step++;show();steps[step].querySelector("input,select")?.focus();return}
    const nI=document.getElementById("cname"),pI=document.getElementById("cphone");
    const nm=nI.value.trim(),ph=pI.value.replace(/[\s-]/g,"").replace(/^\+?966/,"0");
    const okN=!!nm,okP=/^05\d{8}$/.test(ph);
    document.getElementById("eName").hidden=okN;document.getElementById("ePhone").hidden=okP;
    nI.setAttribute("aria-invalid",!okN);pI.setAttribute("aria-invalid",!okP);
    const sum=document.getElementById("errSum");
    if(!okN||!okP){
      const errs=[];if(!okN)errs.push(['cname','الاسم مطلوب']);if(!okP)errs.push(['cphone','رقم الجوال غير صحيح']);
      if(errs.length>1){sum.innerHTML='يرجى تصحيح حقلين:<ul>'+errs.map(([i,t])=>`<li><a href="#${i}" data-fix="${i}">${t}</a></li>`).join("")+'</ul>';sum.hidden=false;sum.focus();
        sum.querySelectorAll("[data-fix]").forEach(l=>l.addEventListener("click",ev=>{ev.preventDefault();document.getElementById(l.dataset.fix).focus()}))}
      else{sum.hidden=true;document.getElementById(errs[0][0]).focus()}
      return}
    sum.hidden=true;
    next.disabled=true;back.disabled=true;next.textContent="جارٍ الإرسال…";
    const svc=f.querySelector("input[name=svc]:checked").value;
    const v=id=>esc_(document.getElementById(id).value);
    const val=id=>document.getElementById(id).value.trim();
    const data={name:nm,phone:ph,service:svc,ptype:val("ptype"),city:val("pcity"),hood:val("phood"),units:val("punits"),time:val("ctime"),details:val("pnote")};
    const sent=lead(svc,nm,ph,[`${data.ptype} في ${data.city}${data.hood?"، "+data.hood:""}`,data.units?data.units+" وحدات":"",data.details,"أفضل وقت: "+data.time].filter(Boolean).join(" · "));
    const waTxt=`السلام عليكم، أنا ${nm}.\nالخدمة: ${svc}\nالعقار: ${data.ptype} في ${data.city}${data.hood?"، "+data.hood:""}${data.units?"\nعدد الوحدات: "+data.units:""}${data.details?"\nتفاصيل: "+data.details:""}\nجوالي: ${ph}، وأفضل وقت للتواصل ${data.time}.`;
    const wa="https://wa.me/966534977299?text="+encodeURIComponent(waTxt);
    setTimeout(()=>{
    document.getElementById("fm").innerHTML=sent
      ?`<div class="done" role="status">${I.shield}<h3 tabindex="-1" id="doneH">وصلنا طلبك يا ${esc_(nm)}</h3><p style="color:var(--muted)">يتواصل معك أحد فريقنا خلال يوم عمل على <b class="en">${ph}</b>.</p><div class="sum"><span>الخدمة: <b>${esc_(svc)}</b></span><span>العقار: <b>${v("ptype")} في ${v("pcity")}${v("phood")?" · "+v("phood"):""}</b></span>${v("punits")?`<span>الوحدات: <b class="en">${v("punits")}</b></span>`:""}</div><div class="ls-acts"><a class="btn btn-g" href="${wa}" target="_blank" rel="noopener">تبي أسرع؟ كلمنا واتساب</a><a class="btn btn-b" href="#projects" data-go="projects">تصفّح العقارات</a></div></div>`
      :`<div class="done" role="status">${I.shield}<h3 tabindex="-1" id="doneH">آخر خطوة يا ${esc_(nm)}</h3><p style="color:var(--muted)">اضغط الزر، وتنفتح لك رسالة واتساب جاهزة فيها كل بياناتك. أرسلها ونتواصل معك خلال يوم عمل.</p><div class="sum"><span>الخدمة: <b>${esc_(svc)}</b></span><span>العقار: <b>${v("ptype")} في ${v("pcity")}${v("phood")?" · "+v("phood"):""}</b></span></div><a class="btn btn-o" href="${wa}" target="_blank" rel="noopener" style="justify-self:start">أرسل الطلب على واتساب</a></div>`;
    document.getElementById("doneH").focus();
    prog.forEach(p=>{p.classList.add("on");p.removeAttribute("aria-current")});
    },500);
  });
  show();
}
