(function(){
  "use strict";

  /* ============ HEADER ON SCROLL ============ */
  const header = document.getElementById('site-header');
  function onScroll(){
    if(window.scrollY > 40){ header.classList.add('scrolled'); }
    else { header.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ============ HERO SCENE CROSSFADE ============ */
  const scenes = document.querySelectorAll('.scene');
  const indicators = document.querySelectorAll('.scene-indicators button');
  let sceneIndex = 0;
  function setScene(i){
    scenes.forEach((s,idx)=>s.classList.toggle('active', idx===i));
    indicators.forEach((b,idx)=>b.classList.toggle('active', idx===i));
    sceneIndex = i;
  }
  indicators.forEach((b)=>{
    b.addEventListener('click', ()=> setScene(parseInt(b.dataset.scene,10)));
  });
  let sceneTimer = setInterval(()=>{
    setScene((sceneIndex+1) % scenes.length);
  }, 5500);
  // pause auto-rotate on manual interaction briefly
  indicators.forEach(b=>b.addEventListener('click', ()=>{
    clearInterval(sceneTimer);
    sceneTimer = setInterval(()=> setScene((sceneIndex+1) % scenes.length), 5500);
  }));

  /* also shift scene subtly on page scroll for parallax feel */
  const heroScenesWrap = document.querySelector('.hero-scenes');
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    if(y < window.innerHeight){
      heroScenesWrap.style.transform = 'translateY(' + (y*0.25) + 'px)';
    }
  }, {passive:true});

  /* ============ SCROLL REVEAL ============ */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  revealEls.forEach(el=>io.observe(el));

/* ============ GALLERY ============ */
  const galleryGrid = document.getElementById('gallery-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');

  const TOTAL_IMAGES = 400; // Ajusta a tu cantidad total de fotos
  const BATCH_SIZE = 20;

  let currentIndex = 1;

  function loadNextBatch() {
    const limit = Math.min(currentIndex + BATCH_SIZE, TOTAL_IMAGES + 1);

    for (let i = currentIndex; i < limit; i++) {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `<img src="images/${i}.jpg" alt="Proyecto ${i}" loading="lazy">`;
      galleryGrid.appendChild(item);
    }

    currentIndex = limit;

    if (currentIndex > TOTAL_IMAGES && loadMoreBtn) {
      loadMoreBtn.style.display = 'none';
    }
  }

  if (galleryGrid) {
    loadNextBatch();
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadNextBatch);
  }
  /* ============ COOKIE BANNER ============ */
  const cookieBanner = document.getElementById('cookie-banner');
  const COOKIE_KEY = 'cb_cookie_consent';
  function getCookieConsent(){
    try{ return document.cookie.split('; ').find(row=>row.startsWith(COOKIE_KEY+'=')); }catch(e){ return null; }
  }
  if(!getCookieConsent()){
    setTimeout(()=> cookieBanner.classList.add('show'), 900);
  }
  function setConsent(value){
    document.cookie = COOKIE_KEY + '=' + value + '; max-age=' + (60*60*24*180) + '; path=/';
    cookieBanner.classList.remove('show');
  }
  document.getElementById('cookie-accept').addEventListener('click', ()=> setConsent('accepted'));
  document.getElementById('cookie-decline').addEventListener('click', ()=> setConsent('declined'));

  /* ============ LANGUAGE SWITCH ============ */
  const langButtons = document.querySelectorAll('.lang-switch button');
  function applyLang(lang){
    const dict = I18N_DATA[lang];
    if(!dict) return;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(dict[key]) el.textContent = dict[key];
    });
    document.documentElement.setAttribute('lang', lang);
    const metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc && dict['meta.description']) metaDesc.setAttribute('content', dict['meta.description']);
    langButtons.forEach(b=>b.classList.toggle('active', b.dataset.lang === lang));
    try{ localStorage.setItem('cb_lang', lang); }catch(e){}
  }
  langButtons.forEach(btn=>{
    btn.addEventListener('click', ()=> applyLang(btn.dataset.lang));
  });
  // restore saved language preference if present
  let initialLang = 'en';
  try{
    const saved = localStorage.getItem('cb_lang');
    if(saved && I18N_DATA[saved]) initialLang = saved;
  }catch(e){}
  if(initialLang !== 'en') applyLang(initialLang);

  /* ============ MOBILE NAV (burger) ============ */
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  burger.addEventListener('click', ()=>{
    const isOpen = navLinks.style.display === 'flex';
    if(isOpen){
      navLinks.style.display = '';
    } else {
      navLinks.style.cssText = 'display:flex;position:fixed;top:70px;left:0;right:0;background:#FAF9F6;flex-direction:column;padding:24px 32px;gap:20px;box-shadow:0 8px 20px rgba(0,0,0,.08);';
      navLinks.querySelectorAll('a').forEach(a=>a.style.color = '#0B1F3A');
    }
  });
  navLinks.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{ if(window.innerWidth <= 900){ navLinks.style.display=''; } });
  });

})();
