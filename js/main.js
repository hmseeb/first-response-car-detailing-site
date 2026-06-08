/**
 * First Response Car Detailing — Main JavaScript
 */

(function () {
  'use strict';

  /* ─── DOM Refs ─────────────────────────────────────────── */
  const header     = document.getElementById('header');
  const navToggle  = document.getElementById('nav-toggle');
  const navMenu    = document.getElementById('nav-menu');
  const navLinks   = document.querySelectorAll('.nav__link');
  const scrollTopBtn = document.getElementById('scroll-top');
  const quoteForm  = document.getElementById('quote-form');
  const formSuccess = document.getElementById('form-success');
  const sections   = document.querySelectorAll('main section[id]');

  /* ─── Header scroll effect ─────────────────────────────── */
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Active nav link based on section in view
    highlightActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  /* ─── Active nav link highlight ────────────────────────── */
  function highlightActiveNav() {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* ─── Mobile nav toggle ────────────────────────────────── */
  function toggleNav(open) {
    const isOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', isOpen);
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  navToggle.addEventListener('click', () => toggleNav());

  // Close nav when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleNav(false);
      }
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      toggleNav(false);
    }
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleNav(false);
      navToggle.focus();
    }
  });

  /* ─── Scroll to top ────────────────────────────────────── */
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── Smooth scroll for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Intersection Observer — fade-in animations ───────── */
  const fadeEls = document.querySelectorAll(
    '.service-card, .testimonial-card, .feature, .process__step, .why-us__images, .why-us__content, .contact__info, .contact__form-wrap'
  );

  fadeEls.forEach((el) => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach((el) => observer.observe(el));

  /* ─── Staggered animation for grids ─────────────────────── */
  function staggerChildren(container, childSelector, delay) {
    const children = container.querySelectorAll(childSelector);
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * delay}ms`;
    });
  }

  staggerChildren(document.querySelector('.services__grid'), '.service-card', 80);
  staggerChildren(document.querySelector('.testimonials__grid'), '.testimonial-card', 60);
  staggerChildren(document.querySelector('.process__steps'), '.process__step', 100);

  /* ─── Contact form handling ─────────────────────────────── */
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      let valid = true;
      const required = quoteForm.querySelectorAll('[required]');

      required.forEach((field) => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      // Email format validation
      const emailField = quoteForm.querySelector('#email');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('error');
        valid = false;
      }

      if (!valid) {
        const firstError = quoteForm.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Simulate form submission (no backend — show success state)
      const submitBtn = quoteForm.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        quoteForm.hidden = true;
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 900);
    });

    // Remove error class on input
    quoteForm.addEventListener('input', function (e) {
      if (e.target.classList.contains('error') && e.target.value.trim()) {
        e.target.classList.remove('error');
      }
    });
  }

  /* ─── Lazy-load hero image ──────────────────────────────── */
  // Hero image uses loading="eager" — no lazy load needed.
  // For other images, the browser handles native lazy loading.

  /* ─── Preload fonts check ────────────────────────────────── */
  document.fonts.ready.then(() => {
    document.documentElement.classList.add('fonts-loaded');
  });

})();
