/* تُدار العقارات — tudar.sa
   مسارات الصور وأيقونات الهوية */
const IMG={
  icAq:"assets/img/icon-aqarat.webp",
  icMl:"assets/img/icon-mullak.webp",
  icMs:"assets/img/icon-mustajirun.webp",
  icSy:"assets/img/icon-siyana.webp",
  icTw:"assets/img/icon-tawasul.webp",
  hero2:"assets/img/hero-building.webp",
  hero:"assets/img/building-cutout.webp"
};
const BI={bAq:`<img class="bico" src="${IMG.icAq}" alt="" width="256" height="256">`,bMl:`<img class="bico" src="${IMG.icMl}" alt="" width="256" height="256">`,bMs:`<img class="bico" src="${IMG.icMs}" alt="" width="256" height="256">`,bSy:`<img class="bico" src="${IMG.icSy}" alt="" width="256" height="256">`,bTw:`<img class="bico" src="${IMG.icTw}" alt="" width="256" height="256">`};
document.documentElement.style.setProperty("--heroimg",`url("${new URL(IMG.hero2,location.href).href}")`);
