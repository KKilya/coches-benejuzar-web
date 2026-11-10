(function(){
  "use strict";

  /* ============ HEADER ON SCROLL ============ */
  const header = document.getElementById('site-header');
  function onScroll(){
    if(window.scrollY > 40 || document.body.classList.contains('menu-open')){ header.classList.add('scrolled'); }
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
  if(scenes.length){
    let sceneTimer = setInterval(()=>{
      setScene((sceneIndex+1) % scenes.length);
    }, 5500);
    // pause auto-rotate on manual interaction briefly
    indicators.forEach(b=>b.addEventListener('click', ()=>{
      clearInterval(sceneTimer);
      sceneTimer = setInterval(()=> setScene((sceneIndex+1) % scenes.length), 5500);
    }));
  }

  /* also shift scene subtly on page scroll for parallax feel */
  const heroScenesWrap = document.querySelector('.hero-scenes');
  // En móvil no hay parallax: da tirones al hacer scroll con el dedo
  if(heroScenesWrap && !window.matchMedia('(max-width:900px)').matches){
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY;
      if(y < window.innerHeight){
        heroScenesWrap.style.transform = 'translateY(' + (y*0.25) + 'px)';
      }
    }, {passive:true});
  }

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

  /* ============ COOKIE BANNER ============ */
  const cookieBanner = document.getElementById('cookie-banner');
  const COOKIE_KEY = 'cb_cookie_consent';
  function getCookieConsent(){
    try{ return document.cookie.split('; ').find(row=>row.startsWith(COOKIE_KEY+'=')); }catch(e){ return null; }
  }
  // El icono de WhatsApp sube mientras se ve el aviso, para no tapar sus botones
  const whatsappFloat = document.querySelector('.whatsapp-float');
  function placeWhatsapp(){
    if(!whatsappFloat) return;
    whatsappFloat.style.bottom = cookieBanner.classList.contains('show') ? (cookieBanner.offsetHeight + 16) + 'px' : '';
  }
  window.addEventListener('resize', placeWhatsapp);
  if(!getCookieConsent()){
    setTimeout(()=>{ cookieBanner.classList.add('show'); placeWhatsapp(); }, 900);
  }
  function setConsent(value){
    document.cookie = COOKIE_KEY + '=' + value + '; max-age=' + (60*60*24*180) + '; path=/';
    cookieBanner.classList.remove('show');
    placeWhatsapp();
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
    document.querySelectorAll('[data-i18n-content]').forEach(el=>{
      const key = el.getAttribute('data-i18n-content');
      if(dict[key]) el.setAttribute('content', dict[key]);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el=>{
      const key = el.getAttribute('data-i18n-aria');
      if(dict[key]) el.setAttribute('aria-label', dict[key]);
    });
    document.documentElement.setAttribute('lang', lang);
    langButtons.forEach(b=>b.classList.toggle('active', b.dataset.lang === lang));
    try{ localStorage.setItem('cb_lang', lang); }catch(e){}
  }
  langButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      // Si el botón lleva data-href, navega a la página estática de ese
      // idioma (/es/, /ru/) en vez de solo cambiar el texto, para que
      // Google indexe una URL real por idioma.
      // Se guarda el idioma elegido antes de navegar; si no, al volver a la
      // página en inglés la localStorage de /es/ o /ru/ reaplicaba ese idioma.
      const href = btn.getAttribute('data-href');
      if(href){
        try{ localStorage.setItem('cb_lang', btn.dataset.lang); }catch(e){}
        window.location.href = href;
        return;
      }
      applyLang(btn.dataset.lang);
    });
  });
  // Páginas estáticas por idioma (/es/, /ru/) fijan window.CB_LOCKED_LANG
  // antes de cargar este script para que la URL mande siempre, y no la
  // localStorage de una visita anterior (ver SEO_NOTES.md).
  let initialLang = 'en';
  if(window.CB_LOCKED_LANG && I18N_DATA[window.CB_LOCKED_LANG]){
    initialLang = window.CB_LOCKED_LANG;
  } else {
    try{
      const saved = localStorage.getItem('cb_lang');
      if(saved && I18N_DATA[saved]) initialLang = saved;
    }catch(e){}
  }
  if(initialLang !== 'en') applyLang(initialLang);

  /* ============ MÓVIL: textos, menú y barra inferior ============ */
  const mDict = I18N_DATA[initialLang] || I18N_DATA.en;
  const waFloat = document.querySelector('.whatsapp-float');
  const waHref = waFloat ? waFloat.getAttribute('href') : 'https://wa.me/34693461811';
  const telLink = document.querySelector('a[href^="tel:"]');
  const telHref = telLink ? telLink.getAttribute('href') : 'tel:+34693461811';
  const WA_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-1-1.1-1.4-1.7-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1.1 2.6c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3z"/></svg>';
  const TEL_ICON = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
  function esc(t){ const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  const waLabel = esc(mDict['video.btn'] || 'WhatsApp');
  const callLabel = esc(mDict['mbar.call'] || 'Call');

  /* ============ MOBILE NAV (burger) ============ */
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if(burger && navLinks){
    // Botones de WhatsApp y llamar al final del menú (solo se ven en móvil)
    const menuActions = document.createElement('div');
    menuActions.className = 'm-menu-actions';
    menuActions.innerHTML = '<a class="btn btn-wa" href="' + waHref + '" target="_blank" rel="noopener">' + WA_ICON + '<span>' + waLabel + '</span></a>' +
      '<a class="btn m-call" href="' + telHref + '">' + TEL_ICON + '<span>' + callLabel + '</span></a>';
    navLinks.appendChild(menuActions);

    function setMenu(open){
      if(open){
        document.documentElement.style.setProperty('--hdr-h', header.offsetHeight + 'px');
      }
      navLinks.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      const label = open ? mDict['nav.close'] : mDict['nav.menu'];
      if(label) burger.setAttribute('aria-label', label);
      onScroll();
    }
    burger.addEventListener('click', ()=>{
      setMenu(!navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>{ setMenu(false); });
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && navLinks.classList.contains('open')) setMenu(false);
    });
    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 900 && navLinks.classList.contains('open')) setMenu(false);
    });
  }

  /* ============ BARRA INFERIOR FIJA (móvil) ============ */
  // Sustituye al icono flotante de WhatsApp en móvil: dos botones grandes,
  // siempre a mano. Aparece al bajar un poco para no tapar la portada.
  const mBar = document.createElement('div');
  mBar.className = 'm-bar';
  mBar.innerHTML = '<a class="m-wa" href="' + waHref + '" target="_blank" rel="noopener">' + WA_ICON + '<span>' + waLabel + '</span></a>' +
    '<a class="m-call" href="' + telHref + '">' + TEL_ICON + '<span>' + callLabel + '</span></a>';
  document.body.appendChild(mBar);
  document.body.classList.add('has-mbar');
  function placeBar(){ mBar.classList.toggle('show', window.scrollY > 240); }
  window.addEventListener('scroll', placeBar, {passive:true});
  placeBar();

})();
