/* تُدار العقارات — tudar.sa
   بطاقات الوحدات ورسمة الغلاف */
/* صورة العرض؛ إن فشل تحميلها تبقى الرسمة البديلة تحتها */
const lsPhoto=(x,big)=>`${facade(x.id%97,x.kind,big)}${x.img?`<img class="lph" src="${x.img}" alt="${x.label} ${x.hood}، ${x.city}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">`:""}`;
const lsPrice=x=>`<b class="num">${fmt(x.price)}</b><small>${x.type==="rent"?"ريال سنويًا":"ريال"}</small>`;
const lsSpecs=x=>[x.beds?`<span>غرف <b class="num">${x.beds}</b></span>`:"",x.baths?`<span>دورات مياه <b class="num">${x.baths}</b></span>`:"",x.area?`<span><b class="num">${x.area}</b> م²</span>`:""].join("");
const lsWa=x=>"https://wa.me/966534977299?text="+encodeURIComponent(`السلام عليكم، أرغب في الاستفسار عن هذا العقار:
${x.t} (${x.type==="rent"?"للإيجار":"للبيع"})
${x.hood}، ${x.city}
السعر: ${fmt(x.price)} ريال${x.type==="rent"?" سنويًا":""}
رقم الإعلان: ${x.id}
رابط الإعلان: https://sa.aqar.fm/ad/${x.id}`);
function cardHTML(x){
  return `<button class="card lcard" data-open="${x.id}" aria-label="تفاصيل ${x.t}"><div class="ph">${lsPhoto(x)}<span class="badge ${x.type==='rent'?'':'b'}">${x.type==="rent"?"للإيجار":"للبيع"}</span></div><div class="bd"><span class="lk">${x.label}</span><h3>${x.t}</h3><div class="loc">${pin}${x.city} · ${x.hood}</div><div class="price">${lsPrice(x)}</div><div class="specs">${lsSpecs(x)}</div></div></button>`;
}
const heroArt=()=>{ /* skyline of stacked slabs ending in the logo key */
  let g=`<svg viewBox="0 0 600 460" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;
  const bs=[[30,250,90],[130,170,110],[250,90,140],[400,200,100],[505,290,80]];
  bs.forEach(([x,y,w],i)=>{g+=`<g class="bld"><rect x="${x}" y="${y}" width="${w}" height="${460-y}" fill="${i===2?'#5E1440':'#3A0824'}"/>`;
    for(let yy=y+24;yy<440;yy+=34){for(let k=0;k<Math.floor(w/26);k++){const on=((i*7+yy+k*13)%5)===0;g+=`<rect x="${x+10+k*26}" y="${yy}" width="14" height="18" fill="${on?'#F7C98F':'#4A0A2E'}"/>`}}
    g+=`<path d="M${x} ${y}h${w}l-${w*0.5} -${w*0.25}h-${w*0.5}z" fill="${i===2?C.orange:'#5E1440'}"/></g>`;});
  g+=`<g transform="translate(320 10)"><g class="hkey"><path d="M0 0l22 22-22 22-22-22z" fill="${C.orange}"/><path d="M0 14l8 8-8 8-8-8z" fill="#4A0A2E"/><path d="M0 44l-24 24h-18l24-24z" fill="${C.orange}"/></g></g>`;
  return g+`</svg>`;
};
