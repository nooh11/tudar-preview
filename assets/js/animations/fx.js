/* تُدار العقارات — tudar.sa
   حركات الظهور (مكتبة Motion): العناوين، البطاقات، العدادات، الأشرطة */
/* ---------- Motion layer (Motion library from jsDelivr; page works without it) ---------- */
const FX=(()=>{
  const M=window.Motion, reduce=matchMedia("(prefers-reduced-motion: reduce)").matches, on=!!(M&&M.animate)&&!reduce;
  const E=[.22,1,.36,1];
  const odo=(el)=>{ /* rolling-digit counter */
    const to=el.dataset.odo;if(!to||el.dataset.done)return;el.dataset.done=1;
    const sm=el.querySelector("small"),suffix=sm?sm.outerHTML:"";
    el.setAttribute("aria-label",to+(sm?" "+sm.textContent:""));
    el.innerHTML=`<span class="odo" aria-hidden="true">${[...to].map(ch=>/\d/.test(ch)?`<span class="od"><span class="od-r">${"0123456789".split("").map(d=>`<span>${d}</span>`).join("")}</span></span>`:`<span>${ch}</span>`).join("")}</span>${suffix}`;
    const digits=[...to].filter(c=>/\d/.test(c));
    el.querySelectorAll(".od-r").forEach((r,i)=>M.animate(r,{y:["0em",`-${digits[i]}em`]},{duration:1.3+i*.2,ease:E,delay:.1}));
  };
  const STAR='<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.9 7.2 16.8 11.1 24 12C16.8 12.9 12.9 16.8 12 24C11.1 16.8 7.2 12.9 0 12C7.2 11.1 11.1 7.2 12 0Z"/></svg>';
  /* Choreography adapted from the Spaces Urbanistic Webflow interactions:
     lines draw (scale 0→1, 1s), split headings slide in from opposite sides (±200px),
     text slides from the side (−100px), images rise/fall into place, image wraps open
     like curtains (height 0→100%), descriptions slide out of a mask (−101%→0),
     timeline row slides in (500px), footer grid drops from its mask, growBigIn (outQuart). */
  const W=[.25,.1,.25,1], OQ=[.25,1,.5,1];
  const IV={margin:"0px 0px 12% 0px"};
  const splitHead=h2=>{ if(h2.dataset.split)return;h2.dataset.split=1;
    const words=h2.textContent.trim().split(/\s+/);if(words.length<2)return null;
    const mid=Math.ceil(words.length/2);const t=h2.textContent;
    h2.setAttribute("aria-label",t.trim());
    h2.innerHTML=`<span class="hA" aria-hidden="true">${words.slice(0,mid).join(" ")}</span> <span class="hB" aria-hidden="true">${words.slice(mid).join(" ")}</span>`;
    return [h2.querySelector(".hA"),h2.querySelector(".hB")];
  };
  const maskP=p=>{ if(p.dataset.mask)return p.firstElementChild;p.dataset.mask=1;p.innerHTML=`<span class="pm-in">${p.innerHTML}</span>`;p.classList.add("pm");return p.firstElementChild};
  function page(root){
    if(!on)return;
    /* hero — PAGE_START («hero»): content in at 0.2s, lines at 0.5s, everything else at 0.6–0.8s */
    const hero=root.querySelector(".hero2");if(hero){
      const q=s=>hero.querySelector(s),qa=s=>[...hero.querySelectorAll(s)];
      M.animate(q(".h3-grid"),{opacity:[0,1]},{duration:.2,delay:.2});
      M.animate(qa(".xl-h,.xl-v"),{scaleX:[0,1],scaleY:[0,1]},{duration:1,delay:.5,ease:W});
      M.animate(q(".l1"),{opacity:[0,1]},{duration:.5,delay:.6});M.animate(q(".l1"),{x:[200,0]},{duration:1,delay:.6,ease:W});
      M.animate(q(".l2"),{opacity:[0,1]},{duration:.5,delay:.6});M.animate(q(".l2"),{x:[-200,0]},{duration:1,delay:.6,ease:W});
      M.animate(qa(".h2-eye,.lead"),{opacity:[0,1],x:[100,0]},{duration:1,delay:.8,ease:W});
      M.animate(q(".intro-c"),{opacity:[0,1],x:[50,0]},{duration:1,delay:.6,ease:W});
      M.animate(q(".h2-img"),{y:["42%","0%"]},{duration:1,delay:.6,ease:W});
      M.animate(qa(".hs"),{opacity:[0,1],scale:[0,1]},{duration:1,ease:OQ,delay:M.stagger(.15,{start:1.5})});
      if(M.scroll)M.scroll(M.animate(q(".h2-txt"),{y:[0,-50],opacity:[1,.3]},{ease:"linear"}),{target:hero,offset:["start start","end start"]});
    }
    /* cover — glass cards rise out of a blur, giant word settles, building climbs; pointer parallax */
    const h3=root.querySelector(".hero3");const heroAnim=()=>{
      const q=x=>h3.querySelector(x),qa=x=>[...h3.querySelectorAll(x)];
      M.animate(q(".h3-word"),{opacity:[0,1],scale:[1.08,1]},{duration:1.4,ease:W});
      M.animate(q(".h3-bld"),{y:[120,0],opacity:[0,1]},{duration:1.2,delay:.3,ease:OQ});
      M.animate(qa(".h3-copy h1 .w"),{opacity:[0,1],y:[34,0],filter:["blur(10px)","blur(0px)"]},{duration:.9,ease:W,delay:M.stagger(.09,{start:.7})});
      M.animate(qa(".h3-copy .lead,.h3-ctas"),{opacity:[0,1],y:[20,0]},{duration:.9,ease:W,delay:M.stagger(.15,{start:1.1})});
      M.animate(q(".h3-pill"),{opacity:[0,1],x:[-40,0]},{duration:1,ease:OQ,delay:1.2});
      M.animate(qa(".gcard"),{opacity:[0,1],y:[60,0]},{duration:1.1,ease:OQ,delay:M.stagger(.14,{start:1.25})});
      if(M.scroll){M.scroll(M.animate(q(".h3-word"),{y:[0,-120]},{ease:"linear"}),{target:h3,offset:["start start","end start"]});
        M.scroll(M.animate(q(".h3-bld"),{scale:[1,1.06]},{ease:"linear"}),{target:h3,offset:["start start","end start"]});}
    };
    if(h3)heroAnim();
    /* section heads — «activity»: line draws, heading halves slide from opposite sides, description slides out of its mask */
    root.querySelectorAll(".sec-head").forEach((h,i)=>{
      const hz=document.createElement("span");hz.className="hz";hz.setAttribute("aria-hidden","true");hz.innerHTML=STAR;h.prepend(hz);
      const ey=h.querySelector(".eyebrow");if(ey){ey.style.setProperty("--dash",["var(--orange)","var(--burg)","var(--navy)"][i%3]);ey.classList.add("pre")}
      const h2=h.querySelector("h2"),halves=h2?splitHead(h2):null,p=h.querySelector("p"),pin=p?maskP(p):null;
      M.inView(h,()=>{
        M.animate(hz,{clipPath:["inset(0 50% 0 50%)","inset(0 0% 0 0%)"]},{duration:1,ease:W});
        M.animate(hz.querySelector(".star"),{scale:[0,1],rotate:[-90,0]},{duration:1,ease:OQ,delay:.2});
        if(ey)requestAnimationFrame(()=>ey.classList.add("drawn"));
        if(halves){M.animate(halves[0],{x:[200,0]},{duration:1,ease:W});M.animate(halves[1],{x:[-200,0]},{duration:1,ease:W});M.animate(halves,{opacity:[0,1]},{duration:.5})}
        else if(h2)M.animate(h2,{opacity:[0,1],y:[30,0]},{duration:1,ease:W});
        if(pin)M.animate(pin,{y:["-101%","0%"]},{duration:1,ease:W});
        M.animate(h.querySelectorAll(".btn"),{opacity:[0,1],y:[20,0]},{duration:.8,delay:.5,ease:W});
      },IV);
    });
    /* «tabs»: the grid rises 100px as one block */
    root.querySelectorAll(".feat,.who,.hid,.vals,.cycle,.contact-g,.grid3,.mdl,.dash,.cmp-wrap,.calc,.faq").forEach(g=>{
      M.inView(g,()=>{M.animate(g,{opacity:[0,1]},{duration:.3});M.animate(g,{y:[100,0]},{duration:1,ease:W})},IV);
    });
    /* slideInRight / slideInLeft on the two service doors */
    root.querySelectorAll(".split").forEach(g=>M.inView(g,()=>{const k=[...g.children];if(k[0])M.animate(k[0],{opacity:[0,1],x:[100,0]},{duration:1,ease:OQ});if(k[1])M.animate(k[1],{opacity:[0,1],x:[-100,0]},{duration:1,ease:OQ})},IV));
    /* image wraps open top→bottom («activity__img-wrap» height 0→100%) */
    root.querySelectorAll(".card .ph,.cta2-p,.logo-story>div:first-child,.h2-strip").forEach(ph=>{
      if(ph.closest(".hero2"))return;
      M.inView(ph,()=>M.animate(ph,{clipPath:["inset(0 0 100% 0)","inset(0 0 0% 0)"]},{duration:1,delay:.5,ease:W}),IV);
    });
    /* «timeline»: row slides in 500px, then each column slides out of its mask */
    root.querySelectorAll(".steps").forEach(g=>M.inView(g,()=>{
      M.animate(g,{opacity:[0,1]},{duration:.5});M.animate(g,{x:[-500,0]},{duration:1,ease:W});
      M.animate([...g.children],{clipPath:["inset(0 0 100% 0)","inset(0 0 0% 0)"]},{duration:1,delay:.5,ease:W});
    },IV));
    /* growBigIn (outQuart) for figures */
    root.querySelectorAll(".nums,.stat4,.kpis").forEach(g=>M.inView(g,()=>M.animate([...g.children],{opacity:[0,1],scale:[0,1]},{duration:1,ease:OQ,delay:M.stagger(.1)}),IV));
    root.querySelectorAll("[data-odo]").forEach(el=>M.inView(el,()=>odo(el)));
    /* bars grow once, from their starting edge to their value (right edge in RTL, bottom for columns) */
    const grow=(b,axis,delay)=>{b.style.transformOrigin=axis==="x"?"100% 50%":"50% 100%";b.style.transform=axis==="x"?"scaleX(0)":"scaleY(0)";
      M.inView(b,()=>{M.animate(b,axis==="x"?{transform:["scaleX(0)","scaleX(1)"]}:{transform:["scaleY(0)","scaleY(1)"]},{duration:1.1,ease:[.22,1,.36,1],delay})},IV)};
    root.querySelectorAll(".vs-bar i,.avb-bar").forEach(b=>grow(b,"x",.2));
    root.querySelectorAll(".bars div").forEach((b,i)=>grow(b,"y",.15+i*.07));
    root.querySelectorAll(".qlines").forEach(ql=>M.inView(ql,()=>{M.animate([...ql.querySelectorAll(".qi")],{y:["105%","0%"]},{duration:1,ease:W,delay:M.stagger(.18)});setTimeout(()=>ql.classList.add("lit"),900)},IV));
    const ctp=root.querySelector(".cta2-p");if(ctp&&M.scroll)M.scroll(M.animate(ctp,{backgroundPositionY:["20%","45%"]},{ease:"linear"}),{target:ctp,offset:["start end","end start"]});
  }
  /* «footer»: three lines draw, then the grid drops out of its mask */
  function footer(){
    if(!on)return;const f=document.querySelector("footer");if(!f||f.dataset.fx)return;f.dataset.fx=1;
    M.inView(f,()=>{
      M.animate([...f.querySelectorAll(".f-lines i")],{scaleX:[0,1],scaleY:[0,1]},{duration:1,ease:W});
      M.animate(f.querySelector(".f-lines .star"),{scale:[0,1],rotate:[-90,0]},{duration:1,ease:OQ,delay:.3});
      M.animate(f.querySelector(".foot"),{y:["-101%","0%"]},{duration:1,delay:.5,ease:W});
    },{margin:"0px 0px 5% 0px"});
  }
  function cards(nodes){if(on&&nodes.length)M.animate([...nodes],{opacity:[0,1],y:[14,0],scale:[.96,1]},{duration:.5,ease:E,delay:M.stagger(.05)})}
  function modal(sheet){if(on)M.animate(sheet,{opacity:[0,1],y:[40,0],scale:[.97,1]},{type:"spring",stiffness:220,damping:26})}
  return {page,cards,modal,on,footer};
})();
