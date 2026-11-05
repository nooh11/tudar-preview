/* تُدار العقارات — tudar.sa
   مشاريعنا */
P.projects=()=>`
<section class="phead"><div class="wrap"><div class="crumb">الرئيسية / مشاريعنا</div><h1>نُخرج عقارك من الفكرة إلى واجهة الســوق</h1><p>عروض نسوّقها الآن في المنطقة الشرقية، للبيع والإيجار.</p>
  <div class="stat4"><div><b class="num" data-cnt="ls">${L.length}</b><span>عرضًا معروضًا الآن</span></div><div><b class="num" data-cnt="sale">${L.filter(x=>x.type==="sale").length}</b><span>للبيع</span></div><div><b class="num" data-cnt="rent">${L.filter(x=>x.type==="rent").length}</b><span>للإيجار</span></div><div><b class="num" dir="ltr"><small>+</small>20</b><span>عقارًا نديرها</span></div></div>
</div></section>
<section class="dark"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">معروض الآن</span><h2>عقارات نسوّقها اليوم</h2><p>اضغط على أي عرض لترى تفاصيله، واستفسر عنه مباشرة على واتساب.</p></div>
  <div class="filters" id="lfil" role="group" aria-label="تصفية العروض">${lfChips()}</div>
  <div class="grid3 lgrid" id="llist">${L.map(cardHTML).join("")}</div>
</div></section>
<section class="dark"><div class="wrap">
  <div class="sec-head"><span class="eyebrow">كيف نسوّق عقارك</span><h2>من المعاينة إلى توقيع العقد</h2></div>
  <div class="steps">
    <div><h3>الاستراتيجية والتسعير</h3><p>نزور العقار ونقارنه بالسوق، ونبني خطة تسويق بسعر قابل للتحقق.</p></div>
    <div><h3>إنتاج المحتوى</h3><p>تصوير احترافي وفيديو قصير وكتيّب للمشروع.</p></div>
    <div><h3>الحملات والمنصات</h3><p>إنستقرام وتيك توك وسناب وأهم المنصات العقارية.</p></div>
    <div><h3>فرز ومعاينات</h3><p>نفرز المهتمين ونرتّب المعاينات الجادّة فقط.</p></div>
    <div><h3>الإطلاق والإتمام</h3><p>يوم إطلاق للمشروع، ثم تفاوض وعقود موثّقة.</p></div>
  </div>
</div></section>
${cta}`;
