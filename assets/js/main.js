/* ==========================================================================
   PAULMARY — Video Editor Portfolio
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIG — edit these values
   whatsappNumber: international format, digits only, no "+" or spaces.
   Example: "2348012345678". Leave empty to hide the WhatsApp button.
   -------------------------------------------------------------------------- */
const CONFIG = {
  email: 'mrigwepaulmary@gmail.com',
  whatsappNumber: '',
  whatsappMessage: "Hello Paulmary, I'd like to discuss a video editing project.",
};

(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2600);
  };

  /* ---------- Header: scrolled state ---------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const burger = $('#burger');
  const setNav = (open) => {
    document.body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  $$('#nav a').forEach((a) => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  /* ---------- Active nav link ---------- */
  const navLinks = $$('.nav__link');
  const sections = navLinks.map((l) => $(l.getAttribute('href'))).filter(Boolean);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  // Stagger siblings that share a parent (e.g. service cards, process steps)
  revealEls.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--delay', `${Math.min(i, 5) * 0.08}s`);
  });

  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Hero timeline: playhead + timecode ---------- */
  const playhead = $('#playhead');
  const timecode = $('#timecode');
  if (playhead && timecode) {
    const LOOP_MS = 14000;      // one pass across the timeline
    const SEQ_SECONDS = 92;     // pretend sequence length shown in timecode
    const FPS = 25;
    const pad = (n) => String(n).padStart(2, '0');
    const render = (p) => {
      playhead.style.setProperty('--p', p.toFixed(4));
      const totalFrames = Math.floor(p * SEQ_SECONDS * FPS);
      const f = totalFrames % FPS;
      const s = Math.floor(totalFrames / FPS);
      timecode.textContent = `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(f)}`;
    };

    if (reducedMotion) {
      render(0.18);
    } else {
      let start = null;
      let visible = true;
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(playhead.parentElement);
      const tick = (t) => {
        if (start === null) start = t;
        if (visible && !document.hidden) render(((t - start) % LOOP_MS) / LOOP_MS);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ---------- YouTube players (load iframe on click) ---------- */
  $$('.player').forEach((player) => {
    const id = player.dataset.yt;
    const thumb = $('.player__thumb', player);
    const button = $('.player__play', player);

    // maxresdefault doesn't exist for every video; YouTube returns a 120px placeholder instead.
    const fallback = () => {
      if (!thumb.src.includes('hqdefault')) thumb.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    };
    thumb.addEventListener('error', fallback);
    thumb.addEventListener('load', () => { if (thumb.naturalWidth <= 120) fallback(); });
    if (thumb.complete && thumb.naturalWidth && thumb.naturalWidth <= 120) fallback();

    button.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      iframe.title = button.getAttribute('aria-label').replace(/^Play\s*/i, '') || 'YouTube video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      player.classList.add('is-playing');
      player.replaceChildren(iframe);
      iframe.focus();
    }, { once: true });
  });

  /* ---------- WhatsApp ---------- */
  const waBtn = $('#whatsapp-btn');
  const waNumber = CONFIG.whatsappNumber.replace(/\D/g, '');
  if (waBtn && waNumber) {
    waBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
    waBtn.hidden = false;
  }

  /* ---------- Copy email ---------- */
  const copyBtn = $('#copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.dataset.email || CONFIG.email;
      try {
        await navigator.clipboard.writeText(email);
        toast('Email address copied');
      } catch {
        window.prompt('Copy the email address:', email);
      }
    });
  }

  /* ---------- Contact form → pre-filled email ---------- */
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const type = String(data.get('type') || '').trim();
      const message = String(data.get('message') || '').trim();

      // Simple validation with inline highlight
      let firstInvalid = null;
      [['name', name], ['email', /^\S+@\S+\.\S+$/.test(email) ? email : ''], ['message', message]].forEach(([field, value]) => {
        const label = form.elements[field].closest('.field');
        label.classList.toggle('is-invalid', !value);
        if (!value && !firstInvalid) firstInvalid = form.elements[field];
      });
      if (firstInvalid) {
        firstInvalid.focus();
        toast('Please fill in your name, a valid email and a short message');
        return;
      }

      const subject = `${type} project enquiry — ${name}`;
      const body = `Hi Paulmary,\n\n${message}\n\nProject type: ${type}\nName: ${name}\nEmail: ${email}`;
      window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    form.addEventListener('input', (e) => {
      const label = e.target.closest('.field');
      if (label && e.target.value.trim()) label.classList.remove('is-invalid');
    });
  }

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
