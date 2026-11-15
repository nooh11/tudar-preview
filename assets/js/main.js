/* تُدار العقارات — tudar.sa
   تشغيل الموقع */
(()=>{
/* الروابط القديمة مثل tudar.sa/#management تُحوَّل للصفحة الجديدة */
const OLD={home:"./",about:"about",management:"property-management",projects:"projects",brief:"free-inspection",contact:"contact"};
const h=(location.hash||"").slice(1);
if(OLD[h]){
  const to=OLD[h]==="./"?"home":OLD[h];
  if(to!==cur){location.replace(OLD[h]+location.search);return}
  try{history.replaceState(null,"",location.pathname+location.search)}catch(e){}
}
paintLogos(document);
FX.footer();
initPage();
})();
