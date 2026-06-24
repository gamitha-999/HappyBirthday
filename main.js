const PAGES = [
  { id: 'section-landing', label: 'Welcome' },
  { id: 'section-harsha', label: 'Harsha' },
  { id: 'section-harshi', label: 'Harshi' }
];

let currentPage = 0;
let isTransitioning = false;
let pageLoaded = false;

function e(id) { return document.getElementById(id); }
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

function safeGsap() {
  return typeof gsap !== 'undefined' && gsap;
}

function ensurePageVisible() {
  const landing = e('section-landing');
  if (!landing) return;
  landing.classList.add('active');
  landing.style.opacity = '1';
  landing.style.visibility = 'visible';
  landing.style.transform = 'none';
  landing.querySelectorAll('.hero-icon, .hero-title, .hero-subtitle, .hero-question, .twin-card, .twin-cards > *, [data-animate], .section-inner').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

/* ===== IMAGE HELPERS ===== */
function createImage(path, alt) {
  const img = document.createElement('img');
  img.src = encodePath(path);
  img.alt = alt || '';
  img.loading = 'lazy';
  img.style.opacity = '0';
  img.onerror = function() { this.style.display = 'none'; };
  img.onload = function() {
    this.style.opacity = '1';
    const r = this.naturalWidth / this.naturalHeight;
    this.dataset.orientation = r > 1.2 ? 'landscape' : r < 0.8 ? 'portrait' : 'square';
  };
  return img;
}

function createMasonry(images, container) {
  if (!container) return;
  container.innerHTML = '';
  const shuffled = shuffleArray(images);
  shuffled.forEach((path, i) => {
    const div = document.createElement('div');
    div.className = 'masonry-item scroll-animate';
    const rot = (Math.random() - 0.5) * 2;
    const yOff = (Math.random() - 0.5) * 6;
    div.style.setProperty('--stack-rot', rot + 'deg');
    div.style.setProperty('--stack-y', yOff + 'px');
    div.style.setProperty('--stack-z', (shuffled.length - i));
    const img = createImage(path, 'Gallery image');
    div.appendChild(img);
    div.addEventListener('click', () => openLightbox(shuffled, i, container));
    container.appendChild(div);
  });
}

function createPolaroidCards(images, container) {
  if (!container) return;
  container.innerHTML = '';
  const shuffled = shuffleArray(images);
  shuffled.forEach((path, i) => {
    const card = document.createElement('div');
    card.className = 'polaroid-card scroll-animate funny-card';
    const rot = (Math.random() - 0.5) * 6;
    card.style.setProperty('--rot', rot + 'deg');
    const img = createImage(path, 'Funny moment');
    card.appendChild(img);
    container.appendChild(card);
  });
}

function createPlayfulCards(images, container) {
  if (!container) return;
  container.innerHTML = '';
  const shuffled = shuffleArray(images);
  shuffled.forEach((path, i) => {
    const card = document.createElement('div');
    card.className = 'playful-card scroll-animate funny-card';
    const rot = (Math.random() - 0.5) * 5;
    const yOff = (Math.random() - 0.5) * 8;
    card.style.setProperty('--rot-fun', rot + 'deg');
    card.style.setProperty('--y-fun', yOff + 'px');
    const img = createImage(path, 'Funny moment');
    card.appendChild(img);
    container.appendChild(card);
  });
}

/* ===== HERO IMAGES ===== */
function setHeroImage(images, containerId) {
  const container = e(containerId);
  if (!container || !images || !images.length) return;
  const imgUrl = encodePath(images[0]);
  const blur = container.querySelector('.hero-bg-blur');
  const main = container.querySelector('.hero-main-img');
  if (blur) blur.style.backgroundImage = `url('${imgUrl}')`;
  if (main) {
    main.src = imgUrl;
    main.style.opacity = '0';
    main.onload = function() { this.style.opacity = '1'; };
  }
}

/* ===== CINEMATIC LIGHTBOX ===== */
let lbImages = [];
let lbIndex = 0;
let lbContainer = null;

function openLightbox(images, index, container) {
  if (!images || !images.length) return;
  lbImages = images;
  lbIndex = index;
  lbContainer = container;
  const lb = e('lightbox');
  if (!lb) return;
  const img = qs('.lightbox-img', lb);
  if (img) {
    img.src = encodePath(images[index]);
    img.style.opacity = '0';
  }
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* Cinematic: blur other images */
  if (container) {
    const items = qsa('.masonry-item', container);
    items.forEach((item, i) => {
      if (i !== index) {
        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.opacity = '0.15';
        item.style.transform = `scale(0.85) translateY(${i < index ? '-' : ''}20px)`;
        item.style.filter = 'blur(4px)';
      } else {
        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        item.style.zIndex = '200';
        item.style.transform = 'scale(1.02)';
      }
    });
  }

  if (safeGsap()) {
    gsap.fromTo(lb,
      { opacity: 0, backdropFilter: 'blur(0px)', '-webkit-backdrop-filter': 'blur(0px)' },
      { opacity: 1, backdropFilter: 'blur(20px)', '-webkit-backdrop-filter': 'blur(20px)', duration: 0.5, ease: 'power3.out' }
    );
    if (img) {
      gsap.fromTo(img,
        { opacity: 0, scale: 0.85, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, delay: 0.15, ease: 'power3.out' }
      );
      gsap.to(img, {
        y: -8, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.8
      });
    }
  } else {
    if (img) setTimeout(() => { img.style.opacity = '1'; }, 50);
  }
}

function closeLightbox() {
  const lb = e('lightbox');
  if (!lb) return;

  /* Cinematic: restore other images */
  if (lbContainer) {
    const items = qsa('.masonry-item', lbContainer);
    items.forEach((item, i) => {
      item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      item.style.opacity = '';
      item.style.transform = '';
      item.style.filter = '';
      item.style.zIndex = '';
    });
  }

  if (safeGsap()) {
    gsap.to(lb, {
      opacity: 0, duration: 0.4, ease: 'power3.in',
      onComplete: () => {
        lb.classList.remove('open');
        lb.style.backdropFilter = '';
        lb.style.opacity = '';
        document.body.style.overflow = '';
      }
    });
  } else {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  lbContainer = null;
}

/* ===== CINEMATIC TRANSITION ===== */
function goToPage(index) {
  if (isTransitioning) return;
  if (index < 0 || index >= PAGES.length) return;
  if (index === 0) {
    switchToPage(index);
    return;
  }
  cinematicTransition(index);
}

function switchToPage(index) {
  qsa('.section').forEach(s => s.classList.remove('active'));
  const target = e(PAGES[index].id);
  if (!target) return;
  target.classList.add('active');
  target.scrollTop = 0;
  currentPage = index;
  if (index === 0) {
    animateLanding();
  } else if (target.dataset.animated !== 'done') {
    target.dataset.animated = 'done';
    setTimeout(() => contentAnimateIn(target), 500);
    setTimeout(() => {
      if (safeGsap()) {
        try {
          qs('.page-hero-content .hero-name', target) && gsap.from(qs('.hero-name', target), { y: 40, opacity: 0, duration: 0.6, ease: 'power3.out' });
          qs('.page-hero-content .hero-tagline', target) && gsap.from(qs('.hero-tagline', target), { y: 30, opacity: 0, duration: 0.6, delay: 0.15, ease: 'power3.out' });
          qs('.page-hero-card', target) && gsap.from(qs('.page-hero-card', target), { y: 40, opacity: 0, scale: 0.95, duration: 0.7, delay: 0.3, ease: 'back.out(1.5)' });
        } catch (e) { /* */ }
      }
    }, 400);
  }
}

function cinematicTransition(index) {
  isTransitioning = true;
  const overlay = e('transitionOverlay');
  if (!overlay) { switchToPage(index); isTransitioning = false; return; }

  const orb = qs('.transition-orb', overlay);
  const glow = qs('.transition-glow', overlay);
  const flash = qs('.transition-flash', overlay);

  overlay.classList.add('active');

  if (safeGsap()) {
    gsap.set(overlay, { opacity: 1, visibility: 'visible' });
    gsap.set(orb, { opacity: 0, scale: 1 });
    gsap.set(glow, { opacity: 0, scale: 1 });
    gsap.set(flash, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        switchToPage(index);
        gsap.set(overlay, { opacity: 0, visibility: 'hidden', background: 'rgba(5,2,10,0)', backdropFilter: 'blur(0px)' });
        gsap.set(orb, { opacity: 0, scale: 1 });
        gsap.set(glow, { opacity: 0 });
        gsap.set(flash, { opacity: 0 });
        overlay.classList.remove('active');
        isTransitioning = false;
      }
    });

    tl.to(overlay, { background: 'rgba(5,2,10,0.85)', backdropFilter: 'blur(16px)', duration: 0.35, ease: 'power2.in' })
      .to(glow, { opacity: 0.6, scale: 3, duration: 0.5, ease: 'power2.out' }, '-=0.1')
      .to(orb, { opacity: 1, scale: 1, duration: 0.1 }, '-=0.05')
      .to(orb, { scale: 20, duration: 0.6, ease: 'power2.in' }, '-=0.05')
      .to(flash, { opacity: 0.9, duration: 0.08 }, '-=0.05')
      .to(flash, { opacity: 0, duration: 0.12 })
      .set(orb, { opacity: 0 })
      .set(glow, { opacity: 0 })
      .to({}, { duration: 0.2 });
  } else {
    switchToPage(index);
    overlay.classList.remove('active');
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    isTransitioning = false;
  }
}

function animateLanding() {
  if (safeGsap()) {
    try {
      qsa('.hero-icon, .hero-title, .hero-subtitle, .hero-question, .twin-cards > *').forEach((el, i) => {
        gsap.fromTo(el, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.1 + i * 0.15, ease: 'power3.out' });
      });
      gsap.to('.twin-card', {
        y: -10, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2
      });
      gsap.to('.hero-icon', {
        y: -12, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1
      });
    } catch (e) { /* */ }
  } else {
    qsa('.hero-icon, .hero-title, .hero-subtitle, .hero-question, .twin-cards > *').forEach(el => {
      el.classList.add('animate-in');
    });
    setTimeout(function() {
      qsa('.hero-icon').forEach(function(el) { el.classList.remove('animate-in'); el.classList.add('after-float'); });
      qsa('.hero-title').forEach(function(el) { el.classList.remove('animate-in'); el.classList.add('after-glow-soft'); });
      qsa('.twin-card').forEach(function(el) { el.classList.remove('animate-in'); el.classList.add('after-glow'); });
    }, 2000);
  }
}

function contentAnimateIn(section) {
  qsa('[data-animate]', section).forEach(el => {
    el.classList.add('ani-in');
  });
  if (safeGsap()) {
    try {
      qsa('[data-animate="stagger"]', section).forEach(el => {
        const children = qsa('.masonry-item, .polaroid-card, .playful-card', el);
        if (children.length) {
          gsap.fromTo(children,
            { y: 40, scale: 0.92, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' }
          );
        }
      });
    } catch (e) { /* */ }
  }
}

/* ===== HERO PARALLAX ENHANCED ===== */
function initHeroParallax() {
  qsa('.page-section').forEach(section => {
    const parallax = qs('.page-hero-img', section);
    const blurLayer = qs('.hero-bg-blur', section);
    if (!parallax) return;
    section.addEventListener('scroll', function() {
      const scrollY = this.scrollTop;
      const vh = window.innerHeight;
      if (scrollY < vh) {
        const progress = scrollY / vh;
        const parallax = qs('.page-hero-img', section);
        const blurLayer = qs('.hero-bg-blur', section);
        const heroContent = qs('.page-hero-content', section);
        if (parallax) parallax.style.transform = `translateY(${scrollY * 0.4}px)`;
        if (blurLayer) blurLayer.style.transform = `translateY(${scrollY * 0.2}px) scale(${1 + progress * 0.1})`;
        if (heroContent) {
          heroContent.style.opacity = 1 - progress * 1.2;
          heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
        }
      }
    });
  });
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.remove('will-reveal');
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1)';
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.content-section').forEach((section, i) => {
    section.style.transition = `opacity 0.8s ease ${i * 0.1}s, transform 0.8s ease ${i * 0.1}s`;
    section.style.willChange = 'opacity, transform';
    section.dataset.revealIndex = i;
    const isHiddenAncestor = function(el) {
      while (el && el !== document.body) {
        if (el.classList && (el.classList.contains('hidden') || (el.classList.contains('section') && !el.classList.contains('active')))) return true;
        el = el.parentElement;
      }
      return false;
    };
    if (isHiddenAncestor(section)) {
      section.classList.add('will-reveal');
      revealObserver.observe(section);
    } else {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0) scale(1)';
    }
  });
}

/* ===== INIT ===== */
function safeInit() {
  try { Effects.initBirthday('celebrationCanvas'); } catch (e) { /* */ }
  try { Effects.initHearts('heartsCanvas'); } catch (e) { /* */ }
  try { Effects.initParticles('particlesCanvas'); } catch (e) { /* */ }
  try { Effects.initSparkles('sparklesCanvas'); } catch (e) { /* */ }
  try { Effects.initOrbs('orbsCanvas'); } catch (e) { /* */ }

  try { initTwinSelection(); } catch (e) { /* */ }
  try { initGalleries(); } catch (e) { /* */ }
  try { initFunnySections(); } catch (e) { /* */ }
  try { initHeroImages(); } catch (e) { /* */ }
  try { Effects.initHeroCelebration('harshaHeroImg'); } catch (e) { /* */ }
  try { Effects.initHeroCelebration('harshiHeroImg'); } catch (e) { /* */ }
  try {
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') goToPage(0);
    });
  } catch (e) { /* */ }
  try { initLightboxControls(); } catch (e) { /* */ }
  try { initHeroParallax(); } catch (e) { /* */ }
  try { Effects.initTiltEffect(); } catch (e) { /* */ }
  try { Effects.initParticleBurst(); } catch (e) { /* */ }
  try { Effects.initShineSweep(); } catch (e) { /* */ }
  try { initScrollAnimations(); } catch (e) { /* */ }
  try { Effects.initScrollReveal(); } catch (e) { /* */ }
  try { Effects.initFloatingGlass('floatingGlassContainer'); } catch (e) { /* */ }

  try {
    var landing = e('section-landing');
    if (landing) {
      landing.classList.add('active');
      landing.style.opacity = '1';
      landing.style.visibility = 'visible';
      currentPage = 0;
      animateLanding();
    }
    setTimeout(function() {
      try { Effects.initSparkleTrail(); } catch (ex) { /* */ }
    }, 100);
  } catch (e) {
    ensurePageVisible();
    isTransitioning = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  pageLoaded = true;

  const safetyTimer = setTimeout(function () {
    if (e('section-landing') && !e('section-landing').classList.contains('active')) {
      ensurePageVisible();
    }
  }, 3000);

  safeInit();
  clearTimeout(safetyTimer);

  if (e('section-landing')) {
    const checkVisible = function () {
      const section = e('section-landing');
      const title = section && section.querySelector('.hero-title');
      if (title && parseFloat(getComputedStyle(title).opacity) < 0.3) {
        ensurePageVisible();
      }
    };
    setTimeout(checkVisible, 600);
    setTimeout(checkVisible, 1200);
    setTimeout(checkVisible, 2400);
  }
});

/* ===== TWIN SELECTION ===== */
function initTwinSelection() {
  qsa('.twin-card').forEach(card => {
    card.addEventListener('click', () => {
      const twin = card.dataset.twin;
      const index = twin === 'harsha' ? 1 : 2;
      Effects.fireConfetti('stars');
      if (safeGsap()) {
        gsap.to(card, {
          scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out',
          onComplete: () => goToPage(index)
        });
      } else {
        goToPage(index);
      }
    });
  });
}

/* ===== HERO IMAGES ===== */
function initHeroImages() {
  const harshaAll = shuffleArray(IMAGES.harsha);
  const harshiAll = shuffleArray(IMAGES.harshi);

  setHeroImage(harshaAll, 'harshaHeroImg');
  setHeroImage(harshiAll, 'harshiHeroImg');

  window._harshaGallery = harshaAll;
  window._harshiGallery = harshiAll;
}

/* ===== GALLERIES ===== */
function initGalleries() {
  const harshaImgs = window._harshaGallery || shuffleArray(IMAGES.harsha);
  const harshiImgs = window._harshiGallery || shuffleArray(IMAGES.harshi);

  const harshaContainer = e('harshaGallery');
  const harshiContainer = e('harshiGallery');
  if (harshaContainer) createMasonry(harshaImgs, harshaContainer);
  if (harshiContainer) createMasonry(harshiImgs, harshiContainer);
}

/* ===== FUNNY SECTIONS ===== */
function initFunnySections() {
  createPolaroidCards(IMAGES.harshaf, e('harshaFunGrid'));
  createPlayfulCards(IMAGES.harshif, e('harshiFunGrid'));
}

/* ===== LIGHTBOX ===== */
function initLightboxControls() {
  const lb = e('lightbox');
  if (!lb) return;
  lb.addEventListener('click', function (ev) {
    if (ev.target === lb) closeLightbox();
  });
  const close = qs('.lightbox-close', lb);
  if (close) close.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (ev) {
    const lightbox = e('lightbox');
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (ev.key === 'Escape') closeLightbox();
    if (ev.key === 'ArrowRight') {
      lbIndex = (lbIndex + 1) % lbImages.length;
      const img = qs('.lightbox-img', lightbox);
      if (img) {
        img.style.opacity = '0';
        setTimeout(() => {
          img.src = encodePath(lbImages[lbIndex]);
          if (safeGsap()) gsap.to(img, { opacity: 1, duration: 0.3 });
          else img.style.opacity = '1';
        }, 150);
      }
    }
    if (ev.key === 'ArrowLeft') {
      lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
      const img = qs('.lightbox-img', lightbox);
      if (img) {
        img.style.opacity = '0';
        setTimeout(() => {
          img.src = encodePath(lbImages[lbIndex]);
          if (safeGsap()) gsap.to(img, { opacity: 1, duration: 0.3 });
          else img.style.opacity = '1';
        }, 150);
      }
    }
  });
}
