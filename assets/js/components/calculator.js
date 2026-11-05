/* تُدار العقارات — tudar.sa
   حاسبة العائد (كشف حساب): الباقات ونسب الأتعاب (5% و7% و10%) والإشغال المستهدف — عدّل من PK وTUD_LATE */
const fmt=n=>Math.round(n).toLocaleString("en-US");
/* management-fee calculator — packages and fees match the official quotation (5% / 7% / 10% of rent actually collected) */
const PK=[
  {n:"التحصيل",fee:.05,occ:.80,h:.5},            /* collection only: occupancy stays as it is */
  {n:"التحصيل والعقود",fee:.07,occ:.85,h:1},     /* contracts + renewals follow-up */
  {n:"الإدارة الشاملة",fee:.10,occ:.95,h:1.5}     /* includes marketing vacant units */
];
let CALC_MSG="",CALC_SUM="";
const TUD_LATE=2;     /* نسبة التأخير مع تُدار (%) */
/* الحاسبة المبسّطة: المالك يجيب عن 3 أسئلة (الشواغر بالأشهر، والتأخير)، ثم يقارن «تديره بنفسك» بـ«نديره نحن».
   لا تظهر أي إشارة سالب: الخصومات تُعرض كبنود، والفرق السالب يتحول إلى رسالة. */
function initCalc(){
  const $=id=>document.getElementById(id),u=$("cu"),r=$("cr");let k=2;
  const q={vac:2,late:5};
  const R=n=>fmt(n)+" ريال";
  const mo=m=>m<=0?"":m<1?"(أقل من شهر)":m===1?"(شهر)":m===2?"(شهرين)":"("+fmt(m)+" شهور)";
  const up=()=>{
    const U=+u.value,rent=+r.value,gross=U*rent,p=PK[k];
    /* تديره بنفسك */
    const v1=U*rent*q.vac/12,l1=(gross-v1)*q.late/100,n1=gross-v1-l1;
    /* نديره نحن: باقة التحصيل لا تغيّر الشواغر؛ الباقتان الأخريان تخفضانها حسب الإشغال المستهدف، ولا تزيدها أبدًا */
    const m2=k===0?q.vac:Math.min(q.vac,12*(1-p.occ)),v2=U*rent*m2/12,lt=Math.min(q.late,TUD_LATE),l2=(gross-v2)*lt/100,col=gross-v2-l2,fee=col*p.fee,n2=col-fee,d=n2-n1;
    $("cuV").textContent=U;$("crV").textContent=R(rent);
    $("g1").textContent=$("g2").textContent=R(gross);
    $("v1").textContent=R(v1);$("v1n").textContent=mo(q.vac);$("l1").textContent=R(l1);$("n1").textContent=R(n1);
    $("v2").textContent=R(v2);$("v2n").textContent=mo(m2);$("l2").textContent=R(l2);
    $("pkN").textContent="· "+p.n;$("feeP").textContent="("+Math.round(p.fee*100)+"%)";$("fee").textContent=R(fee);$("n2").textContent=R(n2);
    $("gain").innerHTML=d>=1000?`<span>يوصلك معنا زيادة كل سنة</span><b>${R(d)}</b><small>وفوقها راحة بالك من المتابعة اليومية.</small>`
      :d>-1000?`<span>دخلك متقارب في الحالتين</span><b class="eq">والفرق في وقتك وراحة بالك من المتابعة اليومية</b>`
      :(q.vac===0&&q.late===0)?`<span>عقارك منتظم اليوم، وهذا جهد منك يُقدَّر</span><b class="eq">ومعنا يبقى بنفس الانتظام، ويرجع لك وقتك</b>`
      :`<span>باقة «${p.n}» ما تكفي لعقارك</span><b class="eq">${q.vac>0&&k<2?"الشواغر تبقى عليك فيها. جرّب «الإدارة الشاملة» وشوف الفرق":"جرّب «الإدارة الشاملة» وشوف الفرق"}</b>`;
    /* data-t: 0 كل الباقات، 1 من «التحصيل والعقود»، 2 «الإدارة الشاملة» فقط */
    let left=0;document.querySelectorAll(".who2 [data-t]").forEach(e=>{const y=k>=+e.dataset.t;e.className=y?"we":"you";e.textContent=y?"نتولاها":"عليك";if(!y)left++});
    $("kN").textContent=U===1?"عقد الوحدة":U===2?"عقدين":U+(U<=10?" عقود":" عقدًا");
    $("rec").innerHTML=k===2?`<b>اخترت الأريح لك.</b> كل اللي فوق نتولاه عنك، وأنت يوصلك التقرير وتتابع من لوحتك.`
      :`<b>باقي عليك ${left} ${left>2?"أمور":"أمرين"} من اللي فوق.</b> مع «الإدارة الشاملة» نتولاها كلها عنك، وتنتهي اتصالات الليل والبحث عن مستأجرين وفنيين. <button type="button" class="rec-b" data-pk-go="2">جرّب الإدارة الشاملة</button>`;
    $("cNote").textContent=`تقدير مبني على إجاباتك. مع تُدار: ${k===0?"الشواغر كما هي لأن باقة «التحصيل» لا تشمل التأجير":"إشغال مستهدف "+Math.round(p.occ*100)+"% في باقة «"+p.n+"»"}، وتأخير لا يتجاوز ${TUD_LATE}%. الأتعاب من الإيجار المحصّل فعليًا، ولا تشمل ضريبة القيمة المضافة.`;
    const vt=["تتأجر على طول","شهر","شهرين","3 شهور","4 شهور أو أكثر"][q.vac],lt2={0:"دايم في وقتهم",5:"يتأخرون أحيانًا",15:"يتأخرون كثير"}[q.late];
    CALC_SUM=`من الحاسبة: ${U} وحدات × ${fmt(rent)} ريال، الشغور ${vt}، الدفع ${lt2}، باقة «${p.n}»`;
    CALC_MSG=(`جربت حاسبة تُدار:\n- عدد الوحدات: ${U}\n- إيجار الوحدة: ${fmt(rent)} ريال سنويًا\n- الشغور: ${vt}\n- الدفع: ${lt2}\n- الباقة: ${p.n}\nيوصلني اليوم تقريبًا ${R(n1)}، ومعكم ${R(n2)}. أبي أعرف التفاصيل.`);
    [u,r].forEach(paintRange)};
  document.querySelectorAll("[data-q]").forEach(b=>b.addEventListener("click",()=>{q[b.dataset.q]=+b.dataset.v;document.querySelectorAll(`[data-q="${b.dataset.q}"]`).forEach(x=>x.setAttribute("aria-checked",x===b));up()}));
  document.querySelectorAll("[data-pk]").forEach(b=>b.addEventListener("click",()=>{k=+b.dataset.pk;document.querySelectorAll("[data-pk]").forEach(x=>x.setAttribute("aria-pressed",x===b));up()}));
  $("rec").addEventListener("click",e=>{if(e.target.closest("[data-pk-go]"))document.querySelector('[data-pk="2"]').click()});
  [u,r].forEach(i=>i.addEventListener("input",up));up();
  waBind(document.getElementById("calc"),()=>({kind:"إدارة أملاك",details:CALC_SUM,msg:CALC_MSG}));
}
