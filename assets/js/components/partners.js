/* تُدار العقارات — tudar.sa
   شريط الشركاء */
const partners=["إحياء العقارية","القمة الأولى","سهم الإنجاز"];  /* أضف أو احذف اسمًا هنا */
const marquee=()=>{const row=partners.map(n=>`<span>${n}</span>`).join("");return `<div class="mq" id="mq"><button class="mq-btn" id="mqBtn" aria-label="إيقاف شريط الشركاء" aria-pressed="false"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" fill="currentColor"/><rect x="9.5" y="2" width="3.5" height="12" fill="currentColor"/></svg></button><div class="mq-track"><div class="mq-in" role="list" aria-label="شركاؤنا">${partners.map(n=>`<span role="listitem">${n}</span>`).join("")}</div><div class="mq-in" aria-hidden="true">${row}</div></div></div>`};
