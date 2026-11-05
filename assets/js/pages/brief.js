/* تُدار العقارات — tudar.sa
   أخبرنا عن مشروعك */
P.brief=()=>`
<section class="phead"><div class="wrap"><div class="crumb">الرئيسية / أخبرنا عن مشروعك</div><h1>أخبرنا عن عقارك</h1><p>ثلاث خطوات، دقيقتان تقريبًا. يتواصل معك مدير حساب خلال يوم عمل.</p></div><span class="deco" data-logo="markrev"></span></section>
<section><div class="wrap">
  <form class="form-shell" id="bf" novalidate>
    <aside class="form-side"><h2>طلبك</h2><ol class="progress" id="prog" aria-label="خطوات الطلب" style="list-style:none;margin:0;padding:0"><li class="on" aria-current="step">نوع الخدمة</li><li>بيانات العقار</li><li>بيانات التواصل</li></ol><ul class="ben"><li>فحص مجاني لعقارك</li><li>خطة مخصصة لكل عقار</li><li>تسويق على أهم المنصات العقارية</li></ul><p style="opacity:.7;font-size:15px">بياناتك تُستخدم للتواصل معك بخصوص عقارك فقط.</p></aside>
    <div class="form-main" id="fm">
      <div class="fs" data-step="0">
        <h3 style="color:var(--burg);font-size:22px">ما الذي تحتاجه؟</h3>
        <div class="choice">
          <label><input type="radio" name="svc" id="svc1" value="إدارة أملاك" checked>${I.key}<b>إدارة أملاك</b><small>عقود، تحصيل، صيانة خلال 48 ساعة</small></label>
          <label><input type="radio" name="svc" id="svc2" value="تسويق عقاري">${I.mega}<b>تسويق عقاري</b><small>بيع أو تأجير عقار أو وحدات</small></label>
          <label class="ch-dev"><input type="radio" name="svc" id="svc3" value="فحص وتطوير عقاري">${I.wrench}<b>فحص وتطوير عقاري <span class="free">الفحص مجاني</span></b><small>نفحص عقارك ونقدّم لك عرض سعر وخطة لرفع دخله، ثم نديره</small></label>
        </div>
      </div>
      <div class="fs" data-step="1" hidden>
        <h3 style="color:var(--burg);font-size:22px">عن العقار</h3>
        <div class="f2">
          <div class="in"><label for="ptype">نوع العقار</label><select id="ptype"><option>عمارة سكنية</option><option>فيلا</option><option>شقة</option><option>أرض</option><option>محل أو مكتب</option></select></div>
          <div class="in"><label for="pcity">المدينة</label><select id="pcity"><option>الدمام</option><option>الخبر</option><option>الظهران</option><option>القطيف</option><option>الجبيل</option><option>الأحساء</option><option>رأس تنورة</option></select></div>
          <div class="in"><label for="phood">الحي</label><input id="phood" autocomplete="off" placeholder="مثال: حي الشاطئ"></div>
          <div class="in"><label for="punits">عدد الوحدات</label><input id="punits" type="number" min="1" inputmode="numeric" placeholder="12" class="en"></div>
        </div>
        <div class="in"><label for="pnote">ملاحظات</label><textarea id="pnote" rows="3" placeholder="حالة العقار، عدد الشواغر، الدخل الحالي، أو ما تريد تطويره"></textarea></div>
      </div>
      <div class="fs" data-step="2" hidden>
        <h3 style="color:var(--burg);font-size:22px">كيف نتواصل معك؟</h3>
        <div class="err-sum" id="errSum" role="alert" tabindex="-1" hidden></div>
        <div class="f2">
          <div class="in"><label for="cname">الاسم</label><input id="cname" autocomplete="name" aria-describedby="eName"><span class="err" id="eName" hidden>اكتب اسمك لنعرف بمن نتصل.</span></div>
          <div class="in"><label for="cphone">رقم الجوال</label><input id="cphone" class="en" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="05xxxxxxxx" dir="ltr" aria-describedby="ePhone"><span class="err" id="ePhone" hidden>اكتب رقمًا سعوديًا من 10 أرقام يبدأ بـ 05.</span></div>
        </div>
        <div class="in"><label for="ctime">أفضل وقت للتواصل</label><select id="ctime"><option>صباحًا</option><option>بعد العصر</option><option>مساءً</option></select></div>
      </div>
      <div class="form-nav" id="fnav"><button type="button" class="btn btn-g" id="back" style="color:var(--burg)" hidden>رجوع</button><button type="submit" class="btn btn-b" id="next">التالي <span class="arr">←</span></button></div>
    </div>
  </form>
</div></section>`;
