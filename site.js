/* Shared on every page: theme toggle, pill menu, scroll progress, back to top, copy buttons, print.
   The saved theme is applied earlier by a one-line script in <head> so there is no flash. */
(function () {
  var root = document.documentElement;
  var tr = window.T || function (k, en) { return en; };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function all(sel) { return [].slice.call(document.querySelectorAll(sel)); }

  /* theme: flip whatever is showing now, remember it */
  var dark = window.matchMedia && matchMedia('(prefers-color-scheme: dark)');
  function isDark() { var t = root.getAttribute('data-theme'); return t ? t === 'dark' : !!(dark && dark.matches); }
  function paintTheme() {
    all('[data-theme-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', isDark() ? 'true' : 'false'); });
  }
  // every colour flips in the same frame (no button fading while the page snaps); where supported,
  // a view transition cross-fades the whole page instead
  function setTheme(t) {
    root.classList.add('theme-switching');
    root.setAttribute('data-theme', t);
    paintTheme();
    root.offsetWidth; // commit the new colours with transitions off
    requestAnimationFrame(function () { root.classList.remove('theme-switching'); });
  }
  all('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = isDark() ? 'light' : 'dark';
      try { localStorage.setItem('theme', t); } catch (e) {}
      if (document.startViewTransition && !reduce) document.startViewTransition(function () { setTheme(t); });
      else setTheme(t);
    });
  });
  paintTheme();

  /* menu pill: Escape or a click outside closes it and focus goes back to the button.
     The panel animates via .open (CSS keeps it visibility:hidden while closed, so it is out of the tab order). */
  var btn = document.getElementById('menu-btn'), menu = document.getElementById('menu');
  function isOpen() { return menu.classList.contains('open'); }
  function setMenu(open, focusBack) {
    if (!btn) return;
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var first = menu.querySelector('a'); if (first) first.focus({ preventScroll: true }); }
    else if (focusBack) btn.focus();
  }
  if (btn && menu) {
    menu.hidden = false; // [hidden] is the no-JS state
    btn.addEventListener('click', function () { setMenu(!isOpen()); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) setMenu(false, true); });
    document.addEventListener('click', function (e) { if (isOpen() && !btn.contains(e.target) && !menu.contains(e.target)) setMenu(false); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    menu.addEventListener('focusout', function (e) { if (e.relatedTarget && !menu.contains(e.relatedTarget) && e.relatedTarget !== btn) setMenu(false); });
  }

  /* scroll progress + back to top */
  var bar = document.querySelector('.progress'), top = document.querySelector('.totop'), queued = false;
  function onScroll() {
    queued = false;
    var y = window.scrollY || 0, max = root.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty('--p', max > 0 ? Math.min(1, y / max) : 0);
    if (top) top.classList.toggle('show', y > innerHeight);
  }
  addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (top) top.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    var home = document.querySelector('.pill.logo'); if (home) home.focus({ preventScroll: true });
  });

  /* copy buttons: data-copy="text" */
  function label(b) { b.textContent = tr('in.copy', 'copy'); b.classList.remove('ok'); }
  all('[data-copy]').forEach(function (b) {
    label(b);
    b.setAttribute('aria-live', 'polite');
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      function done() {
        b.textContent = tr('in.copied', 'copied') + ' ✓'; b.classList.add('ok');
        clearTimeout(b._t); b._t = setTimeout(function () { label(b); }, 1800);
      }
      function legacy() {
        var t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { if (document.execCommand('copy')) done(); } catch (err) {}
        document.body.removeChild(t);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, legacy);
      else legacy();
    });
  });
  document.addEventListener('langchange', function () { all('[data-copy]').forEach(label); });

  /* style ticker: hover eases it to a stop and back (play-state can't be eased, playbackRate can);
     the button holds it paused for keyboard and touch users */
  var ticker = document.querySelector('.ticker'), tkBtn = ticker && ticker.querySelector('.tk-btn');
  var tkAnim = ticker && ticker.querySelector('.ticker-track').getAnimations ? ticker.querySelector('.ticker-track').getAnimations()[0] : null;
  if (ticker && tkAnim && !reduce) {
    var rate = 1, goal = 1, held = false, raf = 0, last = 0;
    var step = function (t) {
      var dt = last ? Math.min(64, t - last) : 16; last = t;
      rate += (goal - rate) * Math.min(1, dt / 120); // ~250ms to settle
      if (Math.abs(goal - rate) < 0.01) rate = goal;
      tkAnim.playbackRate = rate; // keeps the current position
      raf = rate === goal ? 0 : requestAnimationFrame(step);
    };
    var ease = function (to) { goal = held ? 0 : to; if (!raf) { last = 0; raf = requestAnimationFrame(step); } };
    ticker.addEventListener('mouseenter', function () { ease(0); });
    ticker.addEventListener('mouseleave', function () { ease(1); });
    if (tkBtn) tkBtn.addEventListener('click', function () {
      held = !held; tkBtn.setAttribute('aria-pressed', held ? 'true' : 'false'); ease(held ? 0 : 1);
    });
  } else if (tkBtn) {
    tkBtn.addEventListener('click', function () {
      var on = ticker.classList.toggle('stopped'); tkBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* print every FAQ / troubleshooting answer */
  addEventListener('beforeprint', function () { all('details:not([open])').forEach(function (d) { d.setAttribute('open', ''); d._printOpened = true; }); });
  addEventListener('afterprint', function () { all('details').forEach(function (d) { if (d._printOpened) { d.removeAttribute('open'); d._printOpened = false; } }); });
})();
