/* ---- block 1 ---- */
(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const toast=msg=>{const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2200)};

/* ---------- Router ---------- */
const pages=$$('.page').map(p=>p.id.replace('page-',''));
function route(){
  const parts=(location.hash||'#/home').replace(/^#\/?/,'').split('/');
  if(parts[0]==='about'){location.replace('#/home');return;}
  if(parts[0]==='legal'){location.replace('#/trust/'+(parts[1]||'policies'));return;}
  let page=parts[0]||'home'; const anchor=parts[1];
  if(!pages.includes(page)||document.getElementById('page-'+page).hasAttribute('data-hidden')) page='home';
  $$('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+page));
  $$('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===page));
  $$('header a[href^="#/"], nav a[href^="#/"], footer a[href^="#/"]').forEach(a=>{const on=a.getAttribute('href')==='#/'+page;on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});
  $('#dd').classList.toggle('active',['leaders','teachers','students','parents'].includes(page));
  const pg=$('#page-'+page); document.title=(pg.id==='page-home'?'aiSTART — AI curriculum & platform for KG1–Grade 12 schools':(pg.dataset.title||'')+' · aiSTART');
  $('#menu').classList.remove('open'); $('#dd').classList.remove('open');
  const el=anchor&&document.getElementById(page+'-'+anchor);
  if(el){requestAnimationFrame(()=>el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}))}
  else window.scrollTo(0,0);
  /* a11y: move focus to the new content's heading and announce it (not on first load without a deep link) */
  if(route.ready||el){
    const h=el?(el.matches('h1,h2,h3')?el:el.querySelector('h1,h2,h3')):pg.querySelector('h1')||pg.querySelector('h2');
    if(h){if(!h.hasAttribute('tabindex'))h.setAttribute('tabindex','-1');h.classList.add('route-focus');setTimeout(()=>h.focus({preventScroll:true}),30)}
    const name=(pg.dataset.title||'Home');const sub=el&&h?h.textContent.trim().replace(/\s+/g,' '):'';
    const live=document.getElementById('route-live');if(live){live.textContent='';setTimeout(()=>{live.textContent=sub&&sub!==name?name+', '+sub:name},60)}
  }
  route.ready=true;
}
window.addEventListener('hashchange',route);
(()=>{const w=$('.cmp-wrap'); if(!w) return; const u=()=>w.classList.toggle('at-end',w.scrollLeft+w.clientWidth>=w.scrollWidth-4); w.addEventListener('scroll',u,{passive:true}); addEventListener('resize',u); u();})();
/* ---------- Nav ---------- */
$$('.nav-links > a, .dd > button .t, .dd-menu a').forEach(el=>el.dataset.text=el.textContent.trim());
(()=>{const b=$('#burger'),m=$('#menu');
  const set=o=>{m.classList.toggle('open',o);b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu')};
  b.onclick=()=>set(!m.classList.contains('open'));
  m.addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('open')){set(false);b.focus()}});
})();
$('#dd > button').onclick=e=>{e.stopPropagation();const d=$('#dd');d.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',d.classList.contains('open'))};
document.addEventListener('click',e=>{if(!e.target.closest('#dd'))$('#dd').classList.remove('open')});
(()=>{const dd=$('#dd'),btn=$('#dd > button'),hov=matchMedia('(hover:hover) and (min-width:921px)');let t;
  const set=o=>{dd.classList.toggle('open',o);btn.setAttribute('aria-expanded',o)};
  ['pointerenter','mouseenter'].forEach(ev=>dd.addEventListener(ev,()=>{if(!hov.matches)return;clearTimeout(t);set(true)}));
  ['pointerleave','mouseleave'].forEach(ev=>dd.addEventListener(ev,()=>{if(!hov.matches)return;clearTimeout(t);t=setTimeout(()=>set(false),150)}));
  dd.addEventListener('focusin',()=>{if(hov.matches)set(true)});
  dd.addEventListener('focusout',e=>{if(!dd.contains(e.relatedTarget))set(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dd.classList.contains('open')){set(false);btn.focus()}});
})();

/* ---------- Toasts ---------- */

/* skip link: focus main without triggering the hash router */
$('.skip').addEventListener('click',e=>{e.preventDefault(); const m=$('#main'); m.focus({preventScroll:true}); const h=$('.page.active h1'); (h||m).scrollIntoView();});
/* nav shadow on scroll */
(()=>{const n=$('.nav'); const u=()=>n.classList.toggle('scrolled',scrollY>8); addEventListener('scroll',u,{passive:true}); u();})();
/* announce AI demo answers to screen readers */
$$('.ask-out').forEach(o=>{o.setAttribute('aria-live','polite')});
document.addEventListener('click',e=>{const t=e.target.closest('[data-toast]');if(t)toast(t.dataset.toast)});

/* ---------- Accordion ---------- */
$$('.acc > button').forEach(b=>b.onclick=()=>b.parentElement.classList.toggle('open'));

/* ---------- Ask AI mock ---------- */
$$('[data-ask]').forEach(box=>{
  const out=$('.ask-out',box), qs=$('.ask-qs',box);
  const ask=q=>{
    if(!q.trim())return;
    qs.style.display='none'; out.classList.add('on');
    out.innerHTML='<div class="bubble me"></div><div class="bubble ai"><i class="muted">Analyzing authorized data…</i></div>';
    out.firstChild.textContent=q.replace(/^(A teacher might ask|A school leader might ask|Or):\s*/,'');
    setTimeout(()=>{
      out.lastChild.innerHTML='<b>[Wireframe] AI response area</b><br><span class="muted">Summary of relevant patterns, linked students/classes and supporting evidence.</span><div class="bars"><i style="height:40%"></i><i style="height:70%"></i><i style="height:55%"></i><i style="height:85%"></i><i style="height:35%"></i><i style="height:60%"></i></div><p class="muted" style="font-size:12px;margin:8px 0 0">Signals for human review — educators make the decision.</p><button class="btn sm" type="button" style="margin-top:10px">← Ask another</button>';
      $('button',out.lastChild).onclick=()=>{out.classList.remove('on');out.innerHTML='';qs.style.display=''};
    },700);
  };
  $$('.ask-q',box).forEach(b=>b.onclick=()=>ask(b.innerText.replace(/\n/g,' ')));
  $('.ask-form',box).onsubmit=e=>{e.preventDefault();const i=$('input',e.target);ask(i.value);i.value=''};
});

/* ---------- Student Oath ---------- */
const OATH=["I promise to use AI in an ethical, smart and kind way.","I promise to use AI to learn, grow, and create.","I promise not to use AI to cheat or copy.","I promise not to use AI to hurt, bully, or trick others.","I promise to always check if the answers from AI make sense.","I promise to ask questions and think on my own.","I will always remember that AI is a tool, not my boss.","I am responsible for what I create and share.","I promise to use AI to make the world a better place."];
const FINAL="I hereby commit towards how I will use AI.";
$$('[data-oath]').forEach(slot=>{
  const box=document.createElement('div'); box.className='oath step-oath';
  const STEPS=[OATH.slice(0,3),OATH.slice(3,6),OATH.slice(6,9)];
  const SAY=["Hi! Let's make our promise together.","Great start! Three more.","Last three — you've got this!","Now sign it with your name!"];
  box.innerHTML='<div class="so-top"><p class="so-step" tabindex="-1" aria-live="polite"></p><div class="so-bar" aria-hidden="true"><i></i><i></i><i></i><i></i></div></div>'+
    STEPS.map((g,si)=>'<fieldset class="so-page" data-s="'+si+'"><legend class="sr">Promises '+(si*3+1)+' to '+(si*3+3)+'</legend>'+g.map((l,i)=>'<label class="so-item"><input type="checkbox"><span class="so-n">'+(si*3+i+1)+'</span><span>'+l+'</span></label>').join('')+'</fieldset>').join('')+
    '<div class="so-page so-sign" data-s="3"><p class="final">'+FINAL+'</p><div class="field"><label for="oathName">Your name</label><input id="oathName" autocomplete="name" placeholder="Type your first and last name"></div><p class="so-hint">We\'ll add your name and today\'s date to your oath.</p></div>'+
    '<div class="so-nav"><button type="button" class="btn so-back">← Back</button><span class="so-need">Tick all three to continue</span><button type="button" class="btn primary so-next">Next</button><button type="button" class="btn primary so-dl">Download my oath</button></div>'+
    '<div class="oath-done" role="status"></div>';
  slot.appendChild(box);
  const pages=$$('.so-page',box), bars=$$('.so-bar i',box), stepEl=$('.so-step',box), back=$('.so-back',box), next=$('.so-next',box), dl=$('.so-dl',box), need=$('.so-need',box), name=$('#oathName',box), done=$('.oath-done',box), say=$('#boySay');
  let cur=0;
  const ok=()=>cur<3? $$('input[type=checkbox]',pages[cur]).every(c=>c.checked) : name.value.trim().length>1;
  const render=(focus)=>{pages.forEach((p,i)=>p.hidden=i!==cur); bars.forEach((b,i)=>b.classList.toggle('on',i<=cur));
    stepEl.textContent=cur<3?('Step '+(cur+1)+' of 4 · Promises '+(cur*3+1)+'–'+(cur*3+3)):'Step 4 of 4 · Sign your oath';
    back.hidden=cur===0; next.hidden=cur===3; dl.hidden=cur!==3; need.textContent=cur<3?'Tick all three to continue':'Add your name to download';
    const g=ok(); next.disabled=!g; dl.disabled=!g; need.hidden=g; if(say) say.textContent=SAY[cur];
    if(focus) stepEl.focus({preventScroll:true});};
  $$('input[type=checkbox]',box).forEach(c=>c.onchange=()=>render());
  name.oninput=()=>render();
  name.onkeydown=e=>{if(e.key==='Enter'&&!dl.disabled) dl.click();};
  next.onclick=()=>{if(ok()&&cur<3){cur++;render(true); if(cur===3) name.focus();}};
  back.onclick=()=>{if(cur>0){cur--;render(true);}};
  dl.onclick=async()=>{const n=name.value.trim(); if(n.length<2) return; dl.disabled=true; dl.textContent='Preparing…';
    try{await makeOathCert(n);}finally{dl.disabled=false; dl.textContent='Download my oath';}
    done.textContent='✓ '+n+', your Student Oath has been downloaded. Well done!'; done.classList.add('on'); if(say) say.textContent='Well done! Your oath is ready.'; toast('Student Oath downloaded');};
  render();
});
/* boy: slide in on scroll + read the bubble aloud */
(()=>{const boy=$('.oath-boy'); if(!boy) return;
  const show=()=>boy.classList.add('in');
  if(!('IntersectionObserver' in window)) show();
  /* in when it scrolls into view; out again when you scroll back up past it (it drops below the viewport) */
  else{const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) show(); else if(e.boundingClientRect.top>0) boy.classList.remove('in'); }),{threshold:.35}); io.observe(boy);}
  const btn=$('.say-play',boy), txt=$('#boySay'); if(!btn) return;
  /* recorded lines: Voice-1…4 = steps 1…4 */
  const CLIPS={"Hi! Let's make our promise together.": "assets/audio/oath-voice-1.mp3", "Great start! Three more.": "assets/audio/oath-voice-2.mp3", "Last three — you've got this!": "assets/audio/oath-voice-3.mp3", "Now sign it with your name!": "assets/audio/oath-voice-4.mp3"};
  const audio=new Audio(); audio.preload='none';
  const setOn=on=>{btn.setAttribute('aria-pressed',on); btn.setAttribute('aria-label',on?'Stop':'Hear what he says'); $('.say-l',btn).textContent=on?'Stop':'Listen';};
  const stop=()=>{audio.pause(); audio.currentTime=0; setOn(false);};
  const sync=()=>{const has=!!CLIPS[txt.textContent.trim()]; btn.hidden=!has; if(!has) stop();};
  btn.onclick=()=>{ if(btn.getAttribute('aria-pressed')==='true'){stop();return;}
    const src=CLIPS[txt.textContent.trim()]; if(!src) return;
    if(audio.src!==src) audio.src=src; audio.currentTime=0; setOn(true);
    audio.play().catch(()=>setOn(false)); };
  audio.onended=()=>setOn(false); audio.onerror=()=>setOn(false);
  new MutationObserver(()=>{ stop(); sync(); }).observe(txt,{childList:true,characterData:true,subtree:true});
  addEventListener('hashchange',stop); sync();
})();
async function makeOathCert(n){
  try{await document.fonts.load('800 40px "Plus Jakarta Sans"');await document.fonts.load('500 20px "Plus Jakarta Sans"');}catch(e){}
  const W=1240,H=1754,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const F=(w,s)=>w+' '+s+'px "Plus Jakarta Sans", Arial, sans-serif';
  const rr=(X,Y,w,h,r)=>{x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath();};
  const wrap=(t,X,Y,maxW,lh)=>{const ws=t.split(' ');let line='',y=Y;for(const w of ws){const tt=line?line+' '+w:w;if(x.measureText(tt).width>maxW&&line){x.fillText(line,X,y);line=w;y+=lh;}else line=tt;}x.fillText(line,X,y);return y;};
  x.fillStyle='#FCF9F2';x.fillRect(0,0,W,H);
  x.fillStyle='#E3F1F1';x.beginPath();x.arc(W-60,120,220,0,7);x.fill();x.fillStyle='#FEF1E6';x.beginPath();x.arc(80,H-90,180,0,7);x.fill();
  x.fillStyle='#fff';rr(70,70,W-140,H-140,48);x.fill();x.strokeStyle='#E3F1F1';x.lineWidth=6;rr(96,96,W-192,H-192,34);x.stroke();
  x.textAlign='center';
  const logo=document.querySelector('.logo img');
  /* file:// pages can't export a canvas that contains an image file, so use the text logo there */
  if(location.protocol!=='file:'&&logo&&logo.complete&&logo.naturalWidth){const lw=300,lh=lw*logo.naturalHeight/logo.naturalWidth;x.drawImage(logo,W/2-lw/2,150,lw,lh);}
  else{x.fillStyle='#1A3847';x.font=F(800,40);x.fillText('aiSTART',W/2,200);}
  x.fillStyle='#1A3847';x.font=F(800,72);x.fillText('The Student Oath',W/2,310);
  x.fillStyle='#4F6470';x.font=F(500,30);x.fillText('My Commitment to Responsible AI Use',W/2,362);
  x.fillStyle='#F49E58';rr(W/2-50,392,100,8,4);x.fill();
  x.textAlign='left';let y=480;
  OATH.forEach((l,i)=>{x.fillStyle='#008080';x.beginPath();x.arc(190,y-10,22,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=5;x.lineCap='round';x.beginPath();x.moveTo(179,y-10);x.lineTo(187,y-2);x.lineTo(202,y-19);x.stroke();
    x.fillStyle='#1A3847';x.font=F(600,32);y=wrap(l,236,y,W-236-170,42)+84;});
  x.textAlign='center';x.fillStyle='#006B6B';x.font=F(700,34);const fy=wrap(FINAL,W/2,y+20,W-320,44);
  const sy=Math.min(H-300,fy+230);x.strokeStyle='#C9D3D8';x.lineWidth=2;x.beginPath();x.moveTo(260,sy);x.lineTo(W-260,sy);x.stroke();
  x.fillStyle='#1A3847';x.font=F(800,58);x.fillText(n,W/2,sy-24);
  x.fillStyle='#66767F';x.font=F(600,24);x.fillText('Signed by the student · '+new Date().toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric'}),W/2,sy+46);
  x.fillStyle='#8A9AA3';x.font=F(500,22);x.fillText('aiSTART by Slangit Technologies',W/2,H-140);
  const blob=await new Promise(r=>c.toBlob(r,'image/png'));const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='aiSTART-Student-Oath-'+n.replace(/[^\w\- ]+/g,'').trim().replace(/\s+/g,'-')+'.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);
}
$$('[data-download-oath]').forEach(b=>b.onclick=()=>{
  const txt='aiSTART — The Student Oath\nMy Commitment to Responsible AI Use\n\n'+OATH.map((l,i)=>(i+1)+'. '+l).join('\n')+'\n\n'+FINAL+'\n\nName: ____________________    Date: ____________\n';
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'})); a.download='aiSTART-Student-Oath.txt'; a.click();
  toast('Downloading Student Oath (placeholder .txt — replace with designed PDF)');
});

/* ---------- Plan quote buttons ---------- */
$$('[data-tier]').forEach(b=>b.onclick=()=>{$('#plan').value=b.dataset.tier;location.hash='#/demo'});

/* ---------- Research topics ---------- */
const TOPICS=[["Project-Based AI Learning","Pedagogy"],["Responsible AI Literacy & Digital Citizenship","Ethics"],["Human-in-the-Loop Education","Oversight"],["Responsible Learning Analytics & Safeguarding","Governance"],["Teacher AI Readiness & Prompting","Educators"]];
const tg=$('#topicGrid');
TOPICS.forEach(([t,tag])=>{const c=document.createElement('div');c.className='card';c.style.padding='18px';c.innerHTML='<div class="ph" style="min-height:70px;margin-bottom:10px">Thumb</div><span class="stage"></span><h4 style="margin:0"></h4><span class="muted" style="font-size:14px;display:block;margin-top:8px">Coming soon</span>';c.querySelector('.stage').textContent=tag;c.querySelector('h4').textContent=t;tg.appendChild(c)});

/* ---------- Trusted-by logos ---------- */
const SCHOOLS=[
  ["National Protestant College Kfarshima", "assets/img/logos/national-protestant-college-kfarshima.png"],
  ["Rawda High School", "assets/img/logos/rawda-high-school.png"],
  ["St. Hripsimiantz", "assets/img/logos/st-hripsimiantz.png"],
  ["Saint Joseph School", "assets/img/logos/saint-joseph-school.png"],
  ["National Evangelical School Kab-Elias", "assets/img/logos/national-evangelical-school-kab-elias.png"],
  ["Besançon Baskinta", "assets/img/logos/besancon-baskinta.png"],
  ["National American School – NAS", "assets/img/logos/national-american-school-nas.png"],
  ["Secondary Evangelical School", "assets/img/logos/secondary-evangelical-school.png"],
  ["GADEF – Ghana", "assets/img/logos/gadef-ghana.png"],
  ["Collège Protestant Français", "assets/img/logos/college-protestant-francais.svg"]
];
const lt=$('#logoTrack');
if(lt){[0,1].forEach(copy=>SCHOOLS.forEach(([name,src])=>{const li=document.createElement('li'); if(copy) li.setAttribute('aria-hidden','true');
  if(src){const im=document.createElement('img');im.loading='lazy';im.decoding='async';im.src=src;im.alt=copy?'':name;im.title=name;li.appendChild(im);}
  else{const t=document.createElement('span');t.className='logo-text';t.textContent=name;li.appendChild(t);}
  lt.appendChild(li);}));}

/* ---------- Audience cards: hovered card grows ---------- */
(()=>{const box=$('#audCards'); if(!box) return; const cards=$$('.aud-card',box);
  const on=c=>cards.forEach(x=>x.classList.toggle('is-on',x===c));
  cards.forEach(c=>{c.addEventListener('pointerenter',()=>on(c)); c.addEventListener('mouseenter',()=>on(c)); c.addEventListener('focus',()=>on(c));});
  // return to School Leaders when the pointer or focus leaves the row
  ['pointerleave','mouseleave'].forEach(ev=>box.addEventListener(ev,()=>on(cards[0])));
  box.addEventListener('focusout',e=>{if(!box.contains(e.relatedTarget)) on(cards[0]);});
})();

/* ---------- Ink reveal (grey → navy words on scroll) ---------- */
(()=>{$$('.page .s:not(.dark):not([id$="-hero"]) .big-statement').forEach(el=>{ if(!el.children.length && el.textContent.trim().split(/\s+/).length>=5) el.classList.add('ink'); });
  const els=$$('.big-statement.ink'); if(!els.length) return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  els.forEach(el=>{const words=el.textContent.trim().split(/\s+/); el.textContent='';
    words.forEach((w,i)=>{const sp=document.createElement('span'); sp.className='iw'+(reduce?' lit':''); sp.textContent=w; el.appendChild(sp); if(i<words.length-1) el.appendChild(document.createTextNode(' '));});});
  if(reduce) return;
  const upd=()=>els.forEach(el=>{ if(!el.offsetParent) return; const r=el.getBoundingClientRect(), vh=innerHeight;
    const p=Math.max(0,Math.min(1,(vh*0.85-r.top)/(vh*0.5))); const ws=el.querySelectorAll('.iw'), n=Math.round(p*ws.length);
    ws.forEach((w,i)=>w.classList.toggle('lit',i<n)); });
  addEventListener('scroll',upd,{passive:true}); addEventListener('hashchange',()=>setTimeout(upd,60)); upd();
})();

/* ---------- Demo form ---------- */
const form=$('#demoForm');
form.onsubmit=e=>{
  e.preventDefault(); let ok=true;
  $$('[required]',form).forEach(inp=>{
    const f=inp.closest('.field'); let v=inp.type==='checkbox'?inp.checked:inp.value.trim()!=='';
    if(v&&inp.type==='email') v=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim());
    f.classList.toggle('err',!v); inp.setAttribute('aria-invalid',!v); if(!v&&ok){inp.focus();ok=false}
  });
  if(ok){const b=$('button[type=submit]',form); b.disabled=true; b.classList.add('loading'); $('.sb-t',b).textContent='Sending…';
    setTimeout(()=>{form.style.display='none'; const sc=$('#demoSuccess'); sc.classList.add('on'); sc.focus(); b.disabled=false; b.classList.remove('loading'); $('.sb-t',b).textContent='Book my demo';},700);}
};
$$('input,select',form).forEach(i=>['input','change'].forEach(ev=>i.addEventListener(ev,()=>{i.closest('.field').classList.remove('err'); i.removeAttribute('aria-invalid');})));
$('#demoReset').onclick=()=>{form.reset();$('#demoMore').reset();$('#demoMore').hidden=false;$('.df-saved').textContent='';$('#focus').value='general';$('#plan').value='';showFocus();form.style.display='';$('#demoSuccess').classList.remove('on')};
const FOCUS={curriculum:'the curriculum and lessons',platform:'the platform and tools',plans:'plans and a proposal',rollout:'rollout and implementation',training:'teacher training',partnership:'a partnership'};
function showFocus(){const f=$('#focus').value,p=$('#plan').value,el=$('#dfFocus');const t=FOCUS[f]?('We\'ll focus on '+FOCUS[f]+(p?' ('+p+')':'')+'.'):'';el.textContent=t;el.hidden=!t;}
document.addEventListener('click',e=>{if(e.target.closest('[data-focus],[data-tier]'))setTimeout(showFocus,0)});
$('#demoMore').onsubmit=e=>{e.preventDefault();$('#demoMore').hidden=true;$('.df-saved').textContent='Thanks — we\'ll use this to prepare your call.';};

route();

/* =====================================================================
   UI LAYER — motion (content unchanged)
   ===================================================================== */
(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// arrow chips on primary CTAs (skip ones that already end with an arrow)
$$('.btn.primary').forEach(b=>{ if(!/[→↓]\s*$/.test(b.textContent)) b.classList.add('arrow'); });
if(reduce) return;
document.documentElement.classList.add('js-motion');
// liquid scroll reveal removed (images appear without the mask animation)
// word-by-word headline reveal
$$('.page h1, .s.dark h2').forEach(h=>{
  if(h.children.length) return;
  const words=h.textContent.trim().split(/\s+/); h.textContent='';
  words.forEach((w,i)=>{const o=document.createElement('span');o.className='w';const n=document.createElement('span');n.textContent=w;n.style.setProperty('--wd',(i*70)+'ms');o.appendChild(n);h.appendChild(o);if(i<words.length-1)h.appendChild(document.createTextNode(' '));});
  h.classList.add('wsplit');
});
// scroll reveal with stagger
const SEL='.page .s h2:not(.wsplit), .page .s .lead, .page .s .big-statement, .page .s .card, .page .s .stats, .page .s .ask, .page .s .ph, .page .s .roles, .page .s .flow, .page .s .cmp-wrap, .page .s .acc, .page .s .chips, .page .s .ctas, .page .s ul.list';
const els=$$(SEL).filter(el=>!el.closest('#home-hero .ctas')&&!el.closest('.card .card')&&!el.closest('.tabpanel')&&!el.querySelector('.tabpanel')&&!el.closest('.how-media'));
els.forEach(el=>{el.classList.add('rv'); const sib=el.parentElement?[...el.parentElement.children].filter(x=>x.matches&&x.matches(SEL)):[]; const i=Math.min(sib.indexOf(el),6); if(i>0) el.style.setProperty('--rd',(i*90)+'ms');});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target); if(e.target.matches('.stats')) countUp(e.target);}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
els.concat($$('.wsplit')).forEach(el=>io.observe(el));
// stats count-up (same final text)
function countUp(box){$$('b',box).forEach(b=>{const m=b.textContent.match(/^(\d+)(.*)$/); if(!m) return; const end=+m[1],suf=m[2],t0=performance.now(),dur=1200;
  const step=t=>{const k=Math.min(1,(t-t0)/dur),v=Math.round(end*(1-Math.pow(1-k,3)));b.textContent=v+suf; if(k<1) requestAnimationFrame(step);}; b.textContent='0'+suf; requestAnimationFrame(step);});}
})();
})();

/* ---- block 2 ---- */
(()=>{const $=(q,c=document)=>c.querySelector(q),$$=(q,c=document)=>[...c.querySelectorAll(q)];
  /* live feature visuals: scale the fixed-size stage (564x520, or 600x400 wide) to its box, and send each layer in from its own side */
const prep=fv=>{const st=fv.firstElementChild;if(!fv.clientWidth)return;st.style.transform=`scale(${fv.clientWidth/st.offsetWidth})`;
  if(fv.dataset.dir)return;fv.dataset.dir=1;
  $$('.fv-layer',st).forEach(l=>{const cx=l.offsetLeft+l.offsetWidth/2,c=l.classList;let x='0px',y='56px',k=1;
    if(c.contains('fv-cursor')){y='12px';k=.6}else if(c.contains('fv-mock')||c.contains('fv-ask')){y='90px'}else if(cx>330){x='120px';y='0px'}else if(cx<230){x='-120px';y='0px'}
    l.style.setProperty('--fx',x);l.style.setProperty('--fy',y);l.style.setProperty('--fs',k)})};
const fvRO=new ResizeObserver(es=>es.forEach(e=>prep(e.target)));
/* standalone visuals (home Capabilities): play once when scrolled into view */
const fvIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');fvIO.unobserve(e.target)}}),{threshold:.35});
$$('.fv').filter(fv=>!fv.closest('[data-gs]')).forEach(fv=>{fvRO.observe(fv);fvIO.observe(fv)});
/* what's inside: sticky scroll — text scrolls left, pinned stage on the right swaps the matching screen */
$$('[data-gs]').forEach(gs=>{const items=$$('.gs-item',gs),frame=$('.gs-frame',gs);
  const drift={learn:['0%','0%'],teach:['-14%','10%'],manage:['-6%','26%'],expand:['8%','16%']};
  const layers=items.map((it,k)=>{const l=document.createElement('div');l.className='gs-layer'+($('.gs-media',it).classList.contains('gs-art')?' art':'');
    const shot=document.createElement('div');shot.className='gs-shot';[...$('.gs-media',it).children].forEach(n=>{const c=n.cloneNode(true);c.removeAttribute('id');$$('img',c).forEach(i=>{i.alt='';i.loading='eager'});shot.appendChild(c)});
    const chip=document.createElement('div');chip.className='gs-chip';chip.innerHTML=`<b>${String(k+1).padStart(2,'0')}</b><span></span>`;chip.lastChild.textContent=$('h3',it).textContent;
    l.append(shot,chip);frame.appendChild(l);return l});
  let cur=-1;const set=i=>{if(i===cur)return;cur=i;const g=items[i].dataset.g;
    items.forEach((it,k)=>it.classList.toggle('on',k===i));
    layers.forEach((l,k)=>{l.classList.toggle('on',k===i);l.classList.toggle('past',k<i)});
    frame.dataset.g=g;const d=drift[g]||drift.learn;frame.style.setProperty('--bx',d[0]);frame.style.setProperty('--by',d[1]);};
  $$('.fv',gs).forEach(fv=>fvRO.observe(fv));
  gs.classList.add('js');set(0);
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('seen');set(items.indexOf(e.target))}),{rootMargin:'-45% 0px -45% 0px'});
  items.forEach(it=>io.observe(it));
  /* phones: reveal each feature as it enters, even if it never reaches the middle band */
  const reveal=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('seen');reveal.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px'});
  items.forEach(it=>reveal.observe(it));
});
/* newsletter (wireframe) */
$$('[data-nl]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const i=$('input',f),m=$('.nl-msg',f),ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.trim());i.setAttribute('aria-invalid',!ok);m.classList.toggle('err',!ok);m.textContent=ok?'Thanks — you\'re on the list.':'Please enter a valid email address, e.g. name@school.org.';if(ok)i.value=''}));
})();

/* ---- block 3 ---- */
document.addEventListener('click',e=>{const a=e.target.closest('[data-focus]');if(!a)return;const f=document.getElementById('focus');if(f)f.value=a.dataset.focus;});

/* ---- block 4 ---- */
(()=>{const $=(q,c=document)=>c.querySelector(q),$$=(q,c=document)=>[...c.querySelectorAll(q)];
$$('[data-gx]').forEach(gx=>{const st=$('.gx-stage',gx),cards=$$('.gx-card',st),dots=$$('.gx-dot',gx),live=$('#gx-live'),N=cards.length;let cur=0;
  const narrow=matchMedia('(max-width:800px)');
  const place=()=>{const w=narrow.matches;cards.forEach((c,k)=>{let d=k-cur;if(d>N/2)d-=N;if(d<-N/2)d+=N;const a=Math.abs(d);
      const P=a===0?{x:0,sc:1,op:1,v:0,z:5}:a===1?{x:(w?64:68)*Math.sign(d),sc:.8,op:1,v:.9,z:4}:a===2?{x:(w?100:112)*Math.sign(d),sc:.64,op:w?0:1,v:.96,z:3}:{x:130*Math.sign(d),sc:.5,op:0,v:.88,z:1};
      /* curved loop: card centres sit on one circle (radius R) and each card tilts to the circle's tangent */
      const sg=Math.sign(d),W=cards[cur].offsetWidth,R=W*4.8,px=Math.min(Math.abs(P.x)/100*W,R*.9);P.ry=0;P.arc=+(R-Math.sqrt(R*R-px*px)).toFixed(1);P.rz=+(sg*Math.asin(px/R)*180/Math.PI).toFixed(2);
      c.style.setProperty('--x',P.x+'%');c.style.setProperty('--sc',P.sc);c.style.setProperty('--op',P.op);c.style.setProperty('--veil',P.v);c.style.setProperty('--ry',P.ry+'deg');c.style.setProperty('--arc',P.arc+'px');c.style.setProperty('--rz',P.rz+'deg');c.style.setProperty('--y',((cards[cur].offsetHeight-c.offsetHeight)/2).toFixed(1)+'px');c.style.zIndex=P.z;
      c.classList.toggle('on',a===0);c.dataset.off=P.op===0?'hide':'';c.setAttribute('aria-hidden',a!==0);c.toggleAttribute('inert',a!==0)});
    const h=cards[cur].offsetHeight;st.style.setProperty('--gx-h',h+8+'px');
    dots.forEach((b,k)=>{b.classList.toggle('on',k===cur);k===cur?b.setAttribute('aria-current','true'):b.removeAttribute('aria-current')})};
  const go=(i,say=true)=>{cur=(i+N)%N;place();if(say&&live)live.textContent=cards[cur].getAttribute('aria-label')};
  $$('.fc-arrow',gx).forEach(b=>b.onclick=()=>go(cur+ +b.dataset.dir));
  dots.forEach(b=>b.onclick=()=>go(+b.dataset.go));
  cards.forEach((c,k)=>c.addEventListener('click',()=>{if(k!==cur)go(k)}));
  st.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(cur+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(cur-1)}});
  let x0=null;st.addEventListener('pointerdown',e=>{x0=e.clientX});st.addEventListener('pointerup',e=>{if(x0==null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40)go(cur+(dx<0?1:-1))});
  addEventListener('resize',place);narrow.addEventListener&&narrow.addEventListener('change',place);
  new ResizeObserver(place).observe(cards[0]);
  go(0,false);
});})();

/* ---- block 7 ---- */
(()=>{const rows=[...document.querySelectorAll('.gtk-row')];if(!rows.length)return;
  if(!('IntersectionObserver' in window)){rows.forEach(r=>r.classList.add('on'));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on')}),{rootMargin:'0px 0px -35% 0px'});
  rows.forEach(r=>io.observe(r));
  addEventListener('hashchange',()=>{const t=document.getElementById(location.hash.split('/').slice(1).join('-'));const r=t&&t.closest('.gtk-row');if(r)r.classList.add('on')});
})();

/* ---- block 8 ---- */
try{if(/[?&]notes\b/.test(location.search))document.documentElement.classList.add('show-notes')}catch(e){}

/* ---- block 9 ---- */
['platformHeroVideo','teachersHeroVideo'].forEach(id=>{const v=document.getElementById(id);if(!v)return;const b=v.parentElement.querySelector('.hv-play');
  const sync=()=>v.parentElement.classList.toggle('is-playing',!v.paused||v.currentTime>0);
  b.onclick=()=>{v.play().catch(()=>{});v.focus()};
  v.addEventListener('play',sync);v.addEventListener('pause',sync);v.addEventListener('ended',()=>{v.parentElement.classList.remove('is-playing')});
  addEventListener('hashchange',()=>{if(!v.closest('.page.active'))v.pause()});
});

/* ---- block 10 ---- */
(()=>{const hc=document.querySelector('[data-hc]');if(!hc)return;
  /* scroll-linked assembly: side cards slide in as you scroll to the dashboard, and back out when you scroll up */
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const ps=[...hc.querySelectorAll('.hc-tools,.hc-courses,.hc-calendar,.hc-projects')];
  /* sequential: AI tools then courses (left); calendar then projects (right) */
  const WIN={tools:[0,.5],courses:[.5,1],calendar:[0,.5],projects:[.5,1]};
  const key=p=>p.className.match(/hc-(tools|courses|calendar|projects)/)[1];
  const clamp=v=>Math.max(0,Math.min(1,v)), ease=t=>t*t*(3-2*t);
  const onScroll=()=>{if(!hc.closest('.page.active'))return;
    const top=hc.getBoundingClientRect().top+scrollY, H=innerHeight;
    const s0=Math.max(0,top-H), s1=Math.max(s0+240,top-H*.18);
    const p=clamp((scrollY-s0)/(s1-s0));
    ps.forEach(el=>{const [w0,w1]=WIN[key(el)];el.style.setProperty('--e',ease(clamp((p-w0)/(w1-w0))).toFixed(3))})};
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);addEventListener('hashchange',()=>setTimeout(onScroll,50));onScroll();
})();

/* ---- students hero: draggable laptop stickers ---- */
(()=>{document.querySelectorAll('[data-lid]').forEach(wrap=>{
  const lid=wrap.querySelector('.lid'),stks=[...lid.querySelectorAll('.stk')];
  const start=stks.map(s=>[s.style.getPropertyValue('--x'),s.style.getPropertyValue('--y')]);
  let z=10;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const place=(s,xPct,yPct)=>{const L=lid.getBoundingClientRect(),S=s.getBoundingClientRect();
    const maxX=100-S.width/L.width*100,maxY=100-S.height/L.height*100;
    s.style.setProperty('--x',clamp(xPct,-2,maxX+2).toFixed(2)+'%');s.style.setProperty('--y',clamp(yPct,-2,maxY+2).toFixed(2)+'%')};
  stks.forEach(s=>{
    s.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();s.setPointerCapture(e.pointerId);s.focus({preventScroll:true});
      const L=lid.getBoundingClientRect(),S=s.getBoundingClientRect();const ox=e.clientX-S.left,oy=e.clientY-S.top;
      s.style.zIndex=++z;s.classList.add('is-drag');
      const move=ev=>place(s,(ev.clientX-ox-L.left)/L.width*100,(ev.clientY-oy-L.top)/L.height*100);
      const up=()=>{s.classList.remove('is-drag');s.removeEventListener('pointermove',move);s.removeEventListener('pointerup',up);s.removeEventListener('pointercancel',up)};
      s.addEventListener('pointermove',move);s.addEventListener('pointerup',up);s.addEventListener('pointercancel',up)});
    s.addEventListener('keydown',e=>{const d={ArrowLeft:[-2,0],ArrowRight:[2,0],ArrowUp:[0,-2],ArrowDown:[0,2]}[e.key];if(!d)return;e.preventDefault();
      const k=e.shiftKey?4:1;s.style.zIndex=++z;place(s,parseFloat(s.style.getPropertyValue('--x'))+d[0]*k,parseFloat(s.style.getPropertyValue('--y'))+d[1]*k)});
  });
  wrap.querySelector('.lid-reset')?.addEventListener('click',()=>stks.forEach((s,i)=>{s.style.setProperty('--x',start[i][0]);s.style.setProperty('--y',start[i][1]);s.style.zIndex=''}));
})})();

/* ---- curriculum hero: lesson screen, badge and tutor slide in with scroll (reverses on scroll up) ---- */
(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const clamp=v=>Math.max(0,Math.min(1,v)),ease=t=>t*t*(3-2*t);
  document.querySelectorAll('[data-lh]').forEach(lh=>{
  const ps=[...lh.querySelectorAll('.lh-p')].map(el=>({el,w:el.dataset.w.split(',').map(Number)}));
  const on=()=>{if(!lh.closest('.page.active'))return;const top=lh.getBoundingClientRect().top+scrollY,H=innerHeight;
    const s0=Math.max(0,top-H),s1=Math.max(s0+620,top+H*.1),p=clamp((scrollY-s0)/(s1-s0));
    ps.forEach(({el,w})=>el.style.setProperty('--e',ease(clamp((p-w[0])/(w[1]-w[0]))).toFixed(3)))};
  addEventListener('scroll',on,{passive:true});addEventListener('resize',on);addEventListener('hashchange',()=>setTimeout(on,60));on();
  });
})();

/* ---- lesson robot: on hover — tilt the head, green hearts rise behind the face ---- */
(()=>{const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HEART='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 4.5 6.4 4.1c2.1-.2 3.9.9 5.6 2.9 1.7-2 3.5-3.1 5.6-2.9 3.7.4 5.5 4.3 4 7.7C19.5 16.4 12 21 12 21z"/></svg>';
  const GREENS=['#3FB67F','#2FA36F','#5CCB95','#1E9E86','#7AD6A8'];
  document.querySelectorAll('.rb-head').forEach(h=>{
    const box=h.parentElement.querySelector('.rb-hearts');let t=0,flow=0;
    const heart=(delay)=>{if(reduce||!box)return;const el=document.createElement('span');el.className='rb-heart';el.innerHTML=HEART;
      el.style.color=GREENS[Math.floor(Math.random()*GREENS.length)];const sz=.7+Math.random()*.6;el.style.width=(34*sz)+'%';el.style.marginLeft=(-17*sz)+'%';box.appendChild(el);
      const dx=(Math.random()*2-1)*120,rise=-(260+Math.random()*220),rot=(Math.random()*2-1)*25,dur=1500+Math.random()*900;
      el.animate([{transform:'translate(0,0) scale(.4) rotate(0deg)',opacity:0},{transform:`translate(${dx*.3}%,${rise*.3}%) scale(1) rotate(${rot*.4}deg)`,opacity:1,offset:.2},{transform:`translate(${dx}%,${rise}%) scale(.8) rotate(${rot}deg)`,opacity:0}],{duration:dur,delay,easing:'cubic-bezier(.25,.6,.35,1)',fill:'both'}).onfinish=()=>el.remove()};
    const burst=()=>{for(let i=0;i<14;i++)heart(i*60)};
    const start=ms=>{clearTimeout(t);if(!h.classList.contains('is-tilt')){h.classList.add('is-tilt');burst();clearInterval(flow);flow=setInterval(()=>heart(0),260)}if(ms)t=setTimeout(end,ms)};
    const end=()=>{clearTimeout(t);clearInterval(flow);h.classList.remove('is-tilt')};
    h.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')start(0)});
    h.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')end()});
    h.addEventListener('click',()=>{if(!h.classList.contains('is-tilt'))start(1800)});
    h.addEventListener('focus',()=>{if(h.matches(':focus-visible'))start(1800)});h.addEventListener('blur',end);
  });
})();
