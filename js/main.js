(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Reveal on scroll */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it) { if (it.isIntersecting) { it.target.classList.add('show'); io.unobserve(it.target); } });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('show'); });
  }

  /* Mobile menu */
  var toggle = $('#nav-toggle'), menu = $('#mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? '✕' : '☰';
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); toggle.textContent = '☰'; }); });
  }

  /* Modals */
  function openModal(m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal(m) {
    m.classList.remove('open'); document.body.style.overflow = '';
    var v = $('video', m); if (v) v.pause();
  }
  $$('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m || e.target.hasAttribute('data-close')) closeModal(m); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $$('.modal.open').forEach(closeModal); });

  /* Hero video */
  var hero = $('#hero-video');
  if (hero) {
    var p = hero.play(); if (p && p.catch) p.catch(function () {});
    var snd = $('#toggle-sound');
    if (snd) snd.addEventListener('click', function () {
      hero.muted = !hero.muted; hero.play();
      snd.textContent = hero.muted ? '♫' : '🔊';
      snd.setAttribute('aria-label', hero.muted ? 'Enable hero video sound' : 'Mute hero video sound');
    });
    var film = $('#film-modal'), openFilm = $('#open-film');
    if (film && openFilm) openFilm.addEventListener('click', function () {
      var v = $('video', film); openModal(film); v.currentTime = 0; v.play();
    });
  }

  /* Course 3D tilt */
  $$('.course').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      if (innerWidth < 850) return;
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'translateY(-7px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg)';
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  });

  /* Course filters */
  $$('.filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.filter').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      $$('#course-list .course').forEach(function (c) { c.classList.toggle('hidden', f !== 'all' && c.getAttribute('data-cat') !== f); });
    });
  });

  /* Accordions */
  $$('.acc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentNode, panel = item.querySelector('.acc-panel');
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0';
    });
  });

  /* Password show/hide */
  $$('.pw-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var i = document.getElementById(b.getAttribute('data-pw'));
      var show = i.type === 'password'; i.type = show ? 'text' : 'password'; b.textContent = show ? 'HIDE' : 'SHOW';
    });
  });

  /* Query params: preselect course / topic */
  var params = new URLSearchParams(location.search);
  var eCourse = $('#e-course');
  if (eCourse) {
    if (params.get('course')) eCourse.value = params.get('course');
    if (!eCourse.value) eCourse.selectedIndex = 0;
    var upd = function () {
      var o = eCourse.options[eCourse.selectedIndex];
      $('#summary-course').textContent = o.text.split(' — ')[0];
      $('#summary-price').textContent = o.getAttribute('data-price');
    };
    eCourse.addEventListener('change', upd); upd();
  }
  var cTopic = $('#c-topic');
  if (cTopic && params.get('topic')) { cTopic.value = params.get('topic'); if (!cTopic.value) cTopic.selectedIndex = 0; }

  /* Resource modal */
  var rModal = $('#resource-modal');
  if (rModal) {
    var openRes = function (card) {
      var t = card.getAttribute('data-resource');
      $('#resource-title').textContent = t; $('#resource-field').value = t;
      var f = $('form', rModal); f.reset(); f.style.display = ''; $$('.field', f).forEach(function (x) { x.classList.remove('error'); });
      $('.success', rModal).classList.remove('show');
      $$('.field, button[type=submit]', f).forEach(function (x) { x.style.display = ''; });
      openModal(rModal);
    };
    $$('.resource[data-resource]').forEach(function (card) {
      card.addEventListener('click', function () { openRes(card); });
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openRes(card); } });
    });
    if (location.hash) {
      var target = $('.resource' + location.hash);
      if (target) setTimeout(function () { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); openRes(target); }, 350);
    }
  }

  /* Form validation + success state (frontend only — connect to backend later) */
  $$('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('.field', form).forEach(function (f) {
        var input = f.querySelector('input,select,textarea');
        if (!input) return;
        var valid = input.checkValidity();
        f.classList.toggle('error', !valid);
        if (!valid) ok = false;
      });
      $$('input[type=checkbox][required]', form).forEach(function (c) {
        if (!c.checked) { ok = false; c.parentNode.style.color = '#d93c2b'; } else { c.parentNode.style.color = ''; }
      });
      if (!ok) { var first = $('.field.error input, .field.error select, .field.error textarea', form); if (first) first.focus(); return; }
      var success = $('.success', form);
      $$('.field, .row, .checkbox, button[type=submit]', form).forEach(function (x) { x.style.display = 'none'; });
      success.classList.add('show');
    });
    $$('input,select,textarea', form).forEach(function (i) {
      i.addEventListener('input', function () { var f = i.closest('.field'); if (f && i.checkValidity()) f.classList.remove('error'); });
    });
  });

  /* Back to top */
  var top = $('#to-top');
  if (top) {
    addEventListener('scroll', function () { top.classList.toggle('show', scrollY > 600); }, { passive: true });
    top.addEventListener('click', function () { scrollTo({ top: 0, behavior: 'smooth' }); });
  }
})();
