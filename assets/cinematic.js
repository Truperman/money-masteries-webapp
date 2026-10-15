/* Money Masteries: decorative city footage and user-controlled motion. */
(() => {
  'use strict';
  function init() {
    if (document.getElementById('mmCityBackdrop')) return;
    const root = document.documentElement;
    const body = document.body;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let preference = null;
    try { preference = localStorage.getItem('mm-cinematic-motion'); } catch (_) {}
    let paused = preference === 'paused' || (preference !== 'playing' && (reduced.matches || navigator.connection?.saveData));
    let unavailable = false;
    let loaded = false;
    let playbackRequest = 0;
    const backdrop = document.createElement('div');
    backdrop.id = 'mmCityBackdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.innerHTML = '<video id="mmCityVideo" muted loop playsinline preload="none" poster="assets/videos/city-flight-poster.jpg" tabindex="-1" disablepictureinpicture></video><div class="mm-city-shade"></div><div class="mm-city-grain"></div>';
    body.prepend(backdrop);
    body.classList.add('mm-cinematic');
    const video = document.getElementById('mmCityVideo');
    video.muted = true;
    video.defaultMuted = true;
    const buttons = [];
    function addToggle(parent, compact = false) {
      if (!parent) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mm-motion-toggle' + (compact ? ' mm-motion-menu' : '');
      button.setAttribute('aria-controls', 'mmCityVideo');
      button.addEventListener('click', () => {
        if (unavailable) {
          unavailable = false;
          loaded = false;
        }
        paused = !paused;
        try { localStorage.setItem('mm-cinematic-motion', paused ? 'paused' : 'playing'); } catch (_) {}
        update();
      });
      parent.append(button);
      buttons.push(button);
    }
    const head = document.querySelector('#mmHome > .mm-page-head');
    if (head) {
      head.querySelector('.mm-tag')?.remove();
      addToggle(head);
    }
    addToggle(document.querySelector('.mm-header-actions-panel'), true);
    const landing = document.getElementById('mmFunnelWrap');
    if (landing) {
      const holder = document.createElement('div');
      holder.className = 'mm-public-motion';
      landing.prepend(holder);
      addToggle(holder);
      const soundControls = landing.querySelector('.mmf-controls');
      if (soundControls) holder.append(soundControls);
    }
    function labels() {
      buttons.forEach(button => {
        button.innerHTML = '<span aria-hidden="true">' + (paused ? '▷' : 'Ⅱ') + '</span> ' + (unavailable ? 'Retry city view' : paused ? 'Play motion' : 'Pause motion');
        button.setAttribute('aria-pressed', String(!paused));
        button.setAttribute('aria-label', unavailable ? 'Retry the city background video' : paused ? 'Play background video and animation' : 'Pause background video and animation');
      });
    }
    function update() {
      const request = ++playbackRequest;
      body.classList.toggle('mm-motion-paused', !!paused);
      labels();
      if (paused || document.hidden || unavailable) {
        video.pause();
        return;
      }
      if (!loaded) {
        video.src = matchMedia('(max-width: 600px)').matches ? 'assets/videos/city-flight-mobile.mp4' : 'assets/videos/city-flight.mp4';
        video.load();
        loaded = true;
      }
      video.play().catch(() => {
        if (request !== playbackRequest || document.hidden || paused) return;
        // Autoplay restrictions leave a useful still image and an explicit Play control.
        paused = true;
        body.classList.add('mm-motion-paused');
        labels();
      });
    }
    video.addEventListener('playing', () => backdrop.classList.add('is-playing'));
    video.addEventListener('error', () => {
      unavailable = true;
      paused = true;
      backdrop.classList.remove('is-playing');
      update();
    });
    document.addEventListener('visibilitychange', update);
    reduced.addEventListener('change', () => {
      if (reduced.matches) paused = true;
      else {
        try { paused = localStorage.getItem('mm-cinematic-motion') === 'paused'; } catch (_) { paused = false; }
      }
      update();
    });
    update();

    // Gently reveal content as it enters view. Keyboard focus never waits for an effect.
    const reveals = document.querySelectorAll('.mm-overview article,.mm-path button,.mm-master-card,.mm-section-head');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mm-cinema-in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px 30px 0px' });
      reveals.forEach((el, index) => {
        el.classList.add('mm-cinema-reveal');
        el.style.setProperty('--mm-delay', (index % 3) * 65 + 'ms');
        observer.observe(el);
        el.addEventListener('focusin', () => el.classList.add('mm-cinema-in-view'));
      });
    }
    const hero = document.querySelector('.mm-hero');
    const scene = document.querySelector('.mm-scene');
    if (scene) {
      const orbit = document.createElement('div');
      orbit.className = 'mm-gold-orbit';
      scene.prepend(orbit);
    }
    let frame = 0, target = null, pointer = null;
    function reset(el) {
      if (!el) return;
      el.style.removeProperty('--mm-tilt-x');
      el.style.removeProperty('--mm-tilt-y');
      el.style.removeProperty('--mm-glow-x');
      el.style.removeProperty('--mm-glow-y');
    }
    document.addEventListener('pointermove', event => {
      if (paused || reduced.matches || !fine.matches || event.pointerType === 'touch') return;
      const next = event.target.closest('.mm-hero,.mm-master-card');
      if (next !== target) reset(target);
      target = next;
      if (!target) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!target || paused) return;
        const rect = target.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (pointer.x - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (pointer.y - rect.top) / rect.height));
        target.style.setProperty('--mm-glow-x', (x * 100) + '%');
        target.style.setProperty('--mm-glow-y', (y * 100) + '%');
        target.style.setProperty('--mm-tilt-x', ((0.5 - y) * 4) + 'deg');
        target.style.setProperty('--mm-tilt-y', ((x - 0.5) * 5) + 'deg');
        if (target === hero && scene) {
          scene.style.setProperty('--rx', (-16 + (0.5 - y) * 8) + 'deg');
          scene.style.setProperty('--ry', (-20 + (x - 0.5) * 15) + 'deg');
        }
      });
    }, { passive: true });
    document.addEventListener('pointerleave', () => { reset(target); target = null; });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; reset(target); }
    });
    root.dataset.mmDesign = 'gold-city';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
