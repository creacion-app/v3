/* ===================================================
   ARTISAN CAKE FACTORY — JAVASCRIPT
   =================================================== */

'use strict';

/* ---- NAVBAR ---- */
const navbar   = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const navAnchors = navLinks ? navLinks.querySelectorAll('a') : [];

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
}

// Close menu on link click (mobile)
navAnchors.forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Active link on scroll
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < bottom) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });

/* ---- PARTICLES ---- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = window.innerWidth < 600 ? 10 : 20;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 20 + 15}s;
      animation-delay:${Math.random() * 15}s;
      opacity:${Math.random() * 0.4 + 0.05};
    `;
    container.appendChild(p);
  }
}

createParticles();

/* ---- COUNTER ANIMATION ---- */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('tr-TR');
  }, 16);
}

/* ---- INTERSECTION OBSERVER (reveal + counters) ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

/* ---- PRODUCT TABS ---- */
const tabBtns   = document.querySelectorAll('.tab-btn');
const menuCards = document.querySelectorAll('.menu-card');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const tab = btn.getAttribute('data-tab');

    menuCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      const show = tab === 'all' || cat === tab;
      if (show) {
        card.classList.remove('hidden');
        // re-trigger reveal
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 10);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---- GALLERY LIGHTBOX ---- */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');

const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
let currentGalleryIndex = 0;

function openLightbox(index) {
  const item = galleryItems[index];
  const img  = item.querySelector('img');
  const caption = item.querySelector('.gallery-overlay span');

  if (img && img.src && !img.src.endsWith('undefined') && img.naturalWidth > 0) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  } else {
    // No image — show placeholder text
    lightboxImg.src = '';
    lightboxImg.style.display = 'none';
  }

  lightboxCaption.textContent = caption ? caption.textContent : '';
  currentGalleryIndex = index;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lightboxImg.style.display = '';
}

function showPrev() {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentGalleryIndex);
}

function showNext() {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
  openLightbox(currentGalleryIndex);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev)  lightboxPrev.addEventListener('click', showPrev);
if (lightboxNext)  lightboxNext.addEventListener('click', showNext);

lightbox && lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox || !lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')    closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

/* ---- TESTIMONIAL SLIDER ---- */
const track   = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('sliderDots');
const cards   = track ? Array.from(track.children) : [];
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
let currentSlide = 0;
let autoSlide;

function buildDots() {
  if (!dotsContainer || !cards.length) return;
  dotsContainer.innerHTML = '';
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Yorum ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
}

function goToSlide(index) {
  currentSlide = (index + cards.length) % cards.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function startAutoSlide() {
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

buildDots();
startAutoSlide();

if (sliderPrev) sliderPrev.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });
if (sliderNext) sliderNext.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });

// Touch swipe for testimonials
let touchStartX = 0;
track && track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track && track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) { goToSlide(currentSlide + 1); }
    else          { goToSlide(currentSlide - 1); }
    resetAutoSlide();
  }
});

/* ---- CONTACT FORM ---- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function validateField(id, errorId, validator, msg) {
  const input = document.getElementById(id);
  const error = document.getElementById(errorId);
  if (!input || !error) return true;

  const valid = validator(input.value.trim());
  if (!valid) {
    input.classList.add('error');
    error.textContent = msg;
    return false;
  }
  input.classList.remove('error');
  error.textContent = '';
  return true;
}

function validateForm() {
  let ok = true;

  ok = validateField('name', 'nameError',
    v => v.length >= 2, 'Ad soyad en az 2 karakter olmalıdır.') && ok;

  ok = validateField('phone', 'phoneError',
    v => /^[\d\s\+\-\(\)]{10,}$/.test(v), 'Geçerli bir telefon numarası giriniz.') && ok;

  const emailVal = document.getElementById('email')?.value.trim();
  if (emailVal) {
    ok = validateField('email', 'emailError',
      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Geçerli bir e-posta giriniz.') && ok;
  }

  ok = validateField('type', 'phoneError',
    v => v !== '', '') && ok;

  ok = validateField('message', 'messageError',
    v => v.length >= 10, 'Mesajınız en az 10 karakter olmalıdır.') && ok;

  return ok;
}

if (contactForm) {
  // Live validation
  ['name', 'phone', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    el && el.addEventListener('blur', validateForm);
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Gönderiliyor...';

    // Simulate submission delay
    setTimeout(() => {
      contactForm.reset();
      formSuccess.classList.add('visible');
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Mesajı Gönder';

      setTimeout(() => formSuccess.classList.remove('visible'), 6000);
    }, 1400);
  });
}

/* ---- NEWSLETTER ---- */
const newsletterForm    = document.getElementById('newsletterForm');
const newsletterSuccess = document.getElementById('newsletterSuccess');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    newsletterSuccess.style.display = 'block';
    newsletterForm.reset();
    setTimeout(() => { newsletterSuccess.style.display = ''; }, 4000);
  });
}

/* ---- BACK TO TOP ---- */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
}, { passive: true });

backToTop && backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- SMOOTH SCROLL (for browsers without native support) ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- STAGGERED CARD REVEAL ---- */
// Add stagger delays to menu cards
document.querySelectorAll('.menu-card').forEach((card, i) => {
  card.style.transitionDelay = `${(i % 4) * 80}ms`;
});

document.querySelectorAll('.process-step').forEach((step, i) => {
  step.style.transitionDelay = `${i * 150}ms`;
});

/* ---- PARALLAX HERO (subtle) ---- */
window.addEventListener('scroll', () => {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
}, { passive: true });

/* ---- IMAGE LAZY LOADING ---- */
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
        }
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

/* ---- NAV TOGGLE ANIMATION ---- */
navToggle && navToggle.addEventListener('click', () => {
  const spans = navToggle.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

/* ---- INIT: trigger visible for already-on-screen elements ---- */
window.addEventListener('load', () => {
  // Mark all visible elements immediately
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setTimeout(() => el.classList.add('visible'), 100);
    }
  });
});
