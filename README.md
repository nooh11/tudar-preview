# موقع تُدار العقارات (نسخة المعاينة)

نسخة معاينة لموقع https://tudar.sa تُعرض على GitHub Pages، ولا تُفهرس في محركات البحث.

## الصفحات
كل صفحة ملف HTML مستقل، ونصوصها مكتوبة داخله مباشرة. لتعديل أي نص: افتح ملف الصفحة وعدّله.

| الرابط | الملف |
|---|---|
| `/` | `index.html` |
| `/property-management` | `property-management.html` |
| `/real-estate-marketing` | `real-estate-marketing.html` |
| `/projects` | `projects.html` |
| `/calculator` | `calculator.html` |
| `/free-inspection` | `free-inspection.html` |
| `/about` | `about.html` |
| `/contact` | `contact.html` |
| `/privacy` | `privacy.html` |

- **الرأس والتذييل** مكررة في كل الصفحات: أي تعديل عليها يُكرر في كل الملفات.
- **العقارات** تُحدَّث تلقائيًا من تطبيق عقار عبر `.github/scripts/sync-aqar.mjs`، وهو يكتب بين تعليقات `<!--LISTINGS-...-->` في الصفحات. لا تعدّل ما بينها يدويًا.
- **القوالب غير المنشورة** في `_templates/`: قالب مقال للأدلة (`/guides/<slug>`)، وقالب صفحة مدينة (`/property-management/<city>`).
- **نسخة الإنتاج:** `node tools/make-production.mjs dist` يجهّز مجلد dist بدون noindex وبملف robots النهائي، ويفحصه قبل الرفع.

## قيم ناقصة
ابحث في الملفات عن: `{{GTM_ID}}` و`{{CR_NUMBER}}` و`{{OFFICE_ADDRESS}}` و`{{OPENING_HOURS}}`.

## الأدلة المخطط لها (/guides)
1. `/guides/shared-electricity-meter-split`: تقسيم فاتورة الكهرباء على العداد المشترك
2. `/guides/ejar-contract-documentation`: توثيق عقد الإيجار في منصة إيجار
3. `/guides/tenant-not-paying`: المستأجر ما يدفع: وش تسوي بالترتيب؟
4. `/guides/property-management-fees-saudi`: كم تاخذ شركات إدارة الأملاك؟
5. `/guides/landlord-mistakes`: أخطاء الملّاك اللي تضيّع دخل العمارة
6. `/guides/lease-renewal-checklist`: قائمة الـ10 نقاط قبل تجديد عقد المستأجر
7. `/guides/self-managing-vs-company`: إدارة العمارة بنفسك أو بشركة
8. `/guides/dammam-neighborhoods-landlords`: دليل أحياء الدمام للمالك المؤجّر
