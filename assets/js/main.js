/* تُدار العقارات — tudar.sa
   تشغيل الموقع */
(()=>{
paintLogos(document);
FX.footer();
const h=(location.hash||"").slice(1);
const first=pages.includes(h)?h:"home";
try{history.replaceState({p:first},"","#"+first)}catch(e){}
render(first,false);
})();
