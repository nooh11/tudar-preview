/* تُدار العقارات — tudar.sa
   رسومات واجهات المباني (تظهر بديلًا إن لم تتوفر صورة العرض) */
/* ---------- Building facade illustrations (stand-ins until real photos are supplied) ---------- */
function facade(seed,kind,big){
  let s=seed*9301+49297; const r=()=>{s=(s*9301+49297)%233280;return s/233280};
  const W=400,H=300; const sky=[["#F7D9BE","#F3E6D5"],["#E9B996","#F3E6D5"],["#F3E6D5","#FBF6EE"],["#2A0619","#4A0A2E"]][seed%4];
  const night=seed%4===3;
  let g=`<defs><linearGradient id="sk${seed}${big?'b':''}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#sk${seed}${big?'b':''})"/>`;
  g+=`<circle cx="${80+r()*240}" cy="${60+r()*30}" r="${night?14:26}" fill="${night?C.sand:C.orange}" opacity="${night?.8:.85}"/>`;
  // background slabs
  for(let i=0;i<5;i++){const x=r()*W,w=40+r()*70,h=60+r()*90;g+=`<rect x="${x}" y="${H-40-h}" width="${w}" height="${h+40}" fill="${night?'#5E1440':'#E3CFC0'}"/>`}
  const fl=kind==="villa"?2:kind==="land"?0:kind==="office"?6:3+Math.floor(r()*3);
  if(kind==="land"){
    g+=`<rect x="0" y="${H-80}" width="${W}" height="80" fill="#E8C9A6"/>`;
    for(let i=0;i<6;i++)g+=`<path d="M${30+i*62} ${H-60}l10 10-10 10-10-10z" fill="${C.orange}"/>`;
    g+=`<rect x="40" y="${H-150}" width="6" height="90" fill="${C.burg}"/><rect x="40" y="${H-150}" width="120" height="44" fill="${C.burg}"/><text x="100" y="${H-122}" font-family="Noor,sans-serif" font-size="18" fill="${C.sand}" text-anchor="middle">للبيع</text>`;
  } else {
    const bw=kind==="villa"?250:170+r()*40, bx=(W-bw)/2, fh=kind==="villa"?52:34, by=H-40-fl*fh;
    const body=night?"#6B1A47":C.burg;
    g+=`<rect x="${bx}" y="${by}" width="${bw}" height="${fl*fh+40}" fill="${body}"/>`;
    g+=`<path d="M${bx} ${by}l${bw*.62} 0 ${fh*.6} -${fh*.3} ${bw*.38-fh*.6} 0 0 ${fh*.3}z" fill="${C.orange}"/>`;
    for(let f=0;f<fl;f++){const y=by+f*fh+8;const n=kind==="villa"?4:kind==="office"?6:4;const ww=(bw-24)/n;
      for(let k=0;k<n;k++){const lit=night?r()>.35:r()>.75;g+=`<rect x="${bx+12+k*ww+3}" y="${y}" width="${ww-6}" height="${fh-16}" fill="${lit?'#F7C98F':night?'#2A0619':'#F3E6D5'}" opacity="${lit?1:.9}"/>`}
      g+=`<rect x="${bx}" y="${by+f*fh+fh-4}" width="${bw}" height="4" fill="${night?'#4A0A2E':'#3A0824'}"/>`}
    g+=`<rect x="${bx+bw/2-18}" y="${H-40}" width="36" height="40" fill="${C.orange}"/>`;
    if(kind==="villa")g+=`<rect x="${bx-30}" y="${H-58}" width="${bw+60}" height="18" fill="#E3CFC0"/><path d="M${bx-30} ${H-58}h${bw+60}" stroke="${C.burg}" stroke-width="3"/>`;
    g+=`<rect x="${bx-60}" y="${H-60}" width="10" height="20" fill="#5B7B4A"/><circle cx="${bx-55}" cy="${H-66}" r="16" fill="#6E8F57"/><circle cx="${bx+bw+55}" cy="${H-62}" r="14" fill="#6E8F57"/>`;
  }
  g+=`<rect y="${H-40}" width="${W}" height="40" fill="${night?'#2A0619':'#D9BFA6'}"/>`;
  for(let i=0;i<14;i++)g+=`<rect x="${i*32}" y="${H-22}" width="18" height="4" fill="${night?'#4A0A2E':'#F3E6D5'}"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${g}</svg>`;
}
