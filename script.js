/* ============================================================
   WARRIORS GYM — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAV SCROLL ---- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ---- MOBILE NAV TOGGLE ---- */
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---- SMOOTH ACTIVE NAV LINKS ---- */
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav__links a[href^="#"]');

  const observerOptions = { threshold: 0.3 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        allNavLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--color-white)' : '';
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ---- COUNTER ANIMATION ---- */
  const counters = document.querySelectorAll('.hero__stat-num');
  let countersStarted = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  // Trigger once hero stats enter viewport
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll(
    '.equipment__card, .plans__card, .reviews__card, .about__pillar, .contact__detail'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, (entry.target.dataset.delay || 0) * 1);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.5s ease ${(i % 3) * 80}ms, transform 0.5s ease ${(i % 3) * 80}ms`;
    revealObserver.observe(el);
  });

  /* ---- FORM VALIDATION & MODAL ---- */
  const form = document.getElementById('contactForm');
  const modal = document.getElementById('modal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  function openModal() {
    modal.classList.add('open');
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const name = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    let valid = true;

    if (!name) {
      showError('name', 'Please enter your name.');
      valid = false;
    }

    if (!phone) {
      showError('phone', 'Please enter your phone number.');
      valid = false;
    } else if (!/^[6-9]\d{9}$/.test(phone.replace(/\s|\+91/g, ''))) {
      showError('phone', 'Please enter a valid 10-digit Indian mobile number.');
      valid = false;
    }

    if (valid) {
      form.reset();
      openModal();
    }
  });

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.style.borderColor = 'var(--color-red)';
    field.style.boxShadow = '0 0 0 3px rgba(232,32,26,0.2)';

    let err = field.parentNode.querySelector('.form-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error';
      err.style.cssText = `
        font-size: 0.75rem;
        color: var(--color-red);
        margin-top: 0.3rem;
        font-family: var(--font-label);
        letter-spacing: 0.03em;
      `;
      field.parentNode.appendChild(err);
    }
    err.textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });
    form.querySelectorAll('.form-error').forEach(el => el.remove());
  }

  /* ---- HERO PARALLAX (subtle) ---- */
  const heroBgSlash = document.querySelector('.hero__bg-slash');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      const offset = window.scrollY * 0.15;
      if (heroBgSlash) heroBgSlash.style.transform = `translateY(${offset}px)`;
    }
  }, { passive: true });

  /* ---- GALLERY CURSOR HOVER ---- */
  const galleryItems = document.querySelectorAll('.gallery__item');
  galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      galleryItems.forEach(other => {
        if (other !== item) other.style.opacity = '0.6';
      });
    });
    item.addEventListener('mouseleave', () => {
      galleryItems.forEach(other => other.style.opacity = '1');
    });
  });

  // Restore transition on gallery items after initial load
  setTimeout(() => {
    galleryItems.forEach(item => {
      item.style.transition = 'opacity 0.3s ease';
    });
  }, 100);

});
