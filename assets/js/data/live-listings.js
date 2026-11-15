/* تُدار العقارات — tudar.sa
   العقارات المعروضة.
   - القائمة L في الملف data/listings.js، ويكتبه سكربت التحديث تلقائيًا من حساب الشركة في تطبيق عقار.
   - نفس السكربت يكتب البطاقات داخل الصفحات (الرئيسية، والتسويق العقاري، ومشاريعنا) حتى تقرأها محركات البحث.
   - هذا الملف: يحدد 3 عقارات للرئيسية إن لم تُحدد، وأزرار التصفية في «مشاريعنا». */
if(!L.some(x=>x.top))L.slice(0,3).forEach(x=>x.top=true);
const lfChips=()=>`<button class="chip" data-lf="all" aria-pressed="true">الكل</button><button class="chip" data-lf="sale" aria-pressed="false">للبيع</button><button class="chip" data-lf="rent" aria-pressed="false">للإيجار</button>${[...new Set(L.map(x=>x.city))].map(c=>`<button class="chip" data-lf="${c}" aria-pressed="false">${c}</button>`).join("")}`;
