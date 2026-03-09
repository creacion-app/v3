'use strict';

/* ---- NAVBAR ---- */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

navToggle && navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  const spans = navToggle.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks && navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle && navToggle.querySelectorAll('span').forEach(s => {
      s.style.transform = ''; s.style.opacity = '';
    });
  });
});

/* Active nav link on scroll */
const sections = document.querySelectorAll('section[id]');
function setActiveLink() {
  const scrollY = window.scrollY + 90;
  sections.forEach(section => {
    const id   = section.getAttribute('id');
    const link = navLinks && navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      const inView = scrollY >= section.offsetTop &&
                     scrollY < section.offsetTop + section.offsetHeight;
      link.classList.toggle('active', inView);
    }
  });
}
window.addEventListener('scroll', setActiveLink, { passive: true });

/* ---- PARTICLES ---- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = window.innerWidth < 600 ? 8 : 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 22 + 16}s;
      animation-delay:${Math.random() * 18}s;
      opacity:${Math.random() * 0.35 + 0.05};
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ---- REVEAL ON SCROLL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* Stagger for grids */
document.querySelectorAll('.collection-grid .product-card').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
});
document.querySelectorAll('.retail-grid .retail-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 60}ms`;
});
document.querySelectorAll('.logistics-grid .log-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 80}ms`;
});

/* ---- CONTACT FORM ---- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function validateField(id, errorId, validator, msg) {
  const input = document.getElementById(id);
  const error = document.getElementById(errorId);
  if (!input || !error) return true;
  const valid = validator(input.value.trim());
  input.classList.toggle('error', !valid);
  error.textContent = valid ? '' : msg;
  return valid;
}

function validateForm() {
  let ok = true;
  ok = validateField('name', 'nameError',
    v => v.length >= 2, 'Please enter your name or company.') && ok;
  ok = validateField('phone', 'phoneError',
    v => /^[\d\s\+\-\(\)]{6,}$/.test(v), 'Please enter a valid phone number.') && ok;
  ok = validateField('email', 'emailError',
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address.') && ok;
  ok = validateField('message', 'messageError',
    v => v.length >= 10, 'Please enter at least 10 characters.') && ok;
  return ok;
}

if (contactForm) {
  ['name','phone','email','message'].forEach(id => {
    const el = document.getElementById(id);
    el && el.addEventListener('blur', () => validateForm());
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending...';
    setTimeout(() => {
      contactForm.reset();
      formSuccess.classList.add('visible');
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
      setTimeout(() => formSuccess.classList.remove('visible'), 7000);
    }, 1400);
  });
}

/* ---- BACK TO TOP ---- */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop && backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop && backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY
                  - parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--navbar-h') || '76');
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- HERO PARALLAX (subtle) ---- */
window.addEventListener('scroll', () => {
  const heroGrad = document.querySelector('.hero-gradient');
  if (heroGrad && window.scrollY < window.innerHeight * 1.2) {
    heroGrad.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }
}, { passive: true });

/* ---- INIT visible for above-fold elements ---- */
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setTimeout(() => el.classList.add('visible'), 80);
    }
  });
});
