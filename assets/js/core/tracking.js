/* تُدار العقارات — tudar.sa
   التتبع (Google Tag Manager). كل الأحداث تُرسل إلى dataLayer، ومنها يقرأها GTM:
     generate_lead    عند إرسال نموذج «افحص عمارتك مجانًا» (form_name: "free_inspection")
     calculator_used  أول ما يغيّر الزائر أي إجابة في الحاسبة
     whatsapp_click   عند الضغط على أي زر واتساب
     phone_click      عند الضغط على أي رقم اتصال
     consent_granted  عند موافقة الزائر على ملفات تعريف الارتباط
   ومعاملات utm_* من الرابط تُحفظ للجلسة، وتُرسل مع كل طلب عميل (انظر core/leads.js). */
function track(ev,data){try{(window.dataLayer=window.dataLayer||[]).push(Object.assign({event:ev},data||{}))}catch(e){}}
(()=>{
  try{
    const q=new URLSearchParams(location.search),o={};
    ["utm_source","utm_medium","utm_campaign","utm_term","utm_content"].forEach(k=>{const v=q.get(k);if(v)o[k]=v.slice(0,100)});
    if(Object.keys(o).length){o.landing_page=location.pathname;sessionStorage.setItem("tdr_utm",JSON.stringify(o))}
  }catch(e){}
})();
function utmData(){try{return JSON.parse(sessionStorage.getItem("tdr_utm")||"{}")}catch(e){return {}}}
document.addEventListener("click",e=>{
  const w=e.target.closest('a[href*="wa.me"],[data-waq]');
  if(w){track("whatsapp_click",{link_text:(w.textContent||w.getAttribute("aria-label")||"").trim().slice(0,40),page:document.body.dataset.page||""});return}
  const t=e.target.closest('a[href^="tel:"]');
  if(t)track("phone_click",{page:document.body.dataset.page||""});
},true);
