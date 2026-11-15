/* تُدار العقارات — tudar.sa
   شريط الموافقة على ملفات تعريف الارتباط (نظام حماية البيانات الشخصية).
   قبل الموافقة: أدوات القياس والإعلانات معطّلة (Consent Mode في رأس الصفحة).
   الاختيار يُحفظ في المتصفح باسم tdr_consent ("granted" أو "denied"). */
(()=>{
  let s=null;try{s=localStorage.getItem("tdr_consent")}catch(e){}
  if(s)return;
  const b=document.createElement("div");b.className="consent";b.setAttribute("role","region");b.setAttribute("aria-label","ملفات تعريف الارتباط");
  b.innerHTML='<p>نستخدم ملفات تعريف الارتباط وأدوات القياس لمعرفة مصادر الزيارات وتحسين إعلاناتنا، ولا نفعّلها إلا بموافقتك. <a href="privacy">سياسة الخصوصية</a></p><div class="consent-b"><button type="button" class="btn btn-o" data-c="granted">موافق</button><button type="button" class="btn btn-g" data-c="denied">رفض</button></div>';
  b.addEventListener("click",e=>{
    const x=e.target.closest("[data-c]");if(!x)return;const v=x.dataset.c;
    try{localStorage.setItem("tdr_consent",v)}catch(err){}
    if(v==="granted"&&typeof gtag==="function"){gtag("consent","update",{ad_storage:"granted",ad_user_data:"granted",ad_personalization:"granted",analytics_storage:"granted"});track("consent_granted")}
    b.remove();
  });
  document.body.appendChild(b);
})();
