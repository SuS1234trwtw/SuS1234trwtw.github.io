/* Focus demo player: music generated live with the Web Audio API.
   Every track is a fresh random piece (key, chords, melody, groove), so there is no recording and
   nothing copyrighted. Visitors can pick a style, tempo and volume, or play their own audio file
   (it stays on their device). */
(function () {
  var mount = document.getElementById('player-mount');
  if (!mount) return;
  var T = window.T || function (k, en) { return en; };
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STYLES = {
    lofi:    { name: 'lofi',    bpm: [70, 84],  wave: 'triangle', cutoff: 1500, drums: 'lofi',  swing: 0.14, crackle: true,  pad: 0.9,  lead: 0.5,  arp: false, rain: false, verb: 0.25 },
    ambient: { name: 'ambient', bpm: [52, 64],  wave: 'sine',     cutoff: 2400, drums: null,    swing: 0,    crackle: false, pad: 1.0,  lead: 0.35, arp: false, rain: false, verb: 0.6 },
    synth:   { name: 'synth',   bpm: [92, 108], wave: 'sawtooth', cutoff: 1700, drums: 'synth', swing: 0,    crackle: false, pad: 0.55, lead: 0.4,  arp: true,  rain: false, verb: 0.3 },
    rain:    { name: 'rain',    bpm: [56, 66],  wave: 'triangle', cutoff: 1100, drums: null,    swing: 0,    crackle: false, pad: 0.7,  lead: 0.45, arp: false, rain: true,  verb: 0.5 }
  };
  var PROGS = [
    [[0, 3, 7, 10], [5, 8, 12, 15], [10, 14, 17, 20], [3, 7, 10, 14]],
    [[0, 3, 7, 10], [8, 12, 15, 19], [3, 7, 10, 14], [10, 14, 17, 21]],
    [[0, 4, 7, 11], [9, 12, 16, 19], [2, 5, 9, 12], [7, 11, 14, 17]],
    [[0, 3, 7, 10], [3, 7, 10, 14], [8, 12, 15, 19], [7, 11, 14, 17]]
  ];
  var NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  var ADJ = ['soft', 'late', 'quiet', 'neon', 'paper', 'slow', 'warm', 'blue', 'low', 'still', 'hazy', 'small'];
  var NOUN = ['rooms', 'signals', 'orbits', 'tides', 'streets', 'lanterns', 'windows', 'hours', 'notes', 'clouds', 'trains', 'rivers'];

  function rng(seed) { // mulberry32
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function pick(r, list) { return list[Math.floor(r() * list.length)]; }
  function seed() { return Math.floor(Math.random() * 1e9); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function clock(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + pad2(s % 60); }

  /* ---------- markup ---------- */
  mount.innerHTML =
    '<div class="term player" id="player">' +
    '<div class="term-bar"><span id="np-head"></span><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span></div>' +
    '<div class="term-body">' +
    '<p class="np-title mq" id="np-title"><span></span></p>' +
    '<p class="k np-artist" id="np-artist"></p>' +
    '<p class="k np-up mq" id="np-up"><span></span></p>' +
    '<div class="np-bar"><span id="np-pos">0:00</span><div class="track" id="np-track"><i id="np-fill"></i></div><span id="np-len">0:00</span></div>' +
    '<div class="np-ctl">' +
    '<button type="button" id="np-prev">&#9198;</button>' +
    '<button type="button" id="np-play" class="pp">&#9654;</button>' +
    '<button type="button" id="np-next">&#9197;</button>' +
    '</div></div>' +
    '<div class="np-opts">' +
    '<div class="np-row" role="radiogroup" id="np-styles">' +
    Object.keys(STYLES).map(function (k) { return '<button type="button" class="chip" role="radio" data-style="' + k + '"></button>'; }).join('') +
    '</div>' +
    '<label class="np-slider"><span id="np-tempo-l"></span><input type="range" id="np-tempo" min="-20" max="20" value="0" step="1"><em id="np-bpm">&mdash; bpm</em></label>' +
    '<label class="np-slider"><span id="np-vol-l"></span><input type="range" id="np-vol" min="0" max="100" value="70"><em id="np-volv">70%</em></label>' +
    '<div class="np-row"><button type="button" class="chip" id="np-file-btn"></button><input type="file" id="np-file" accept="audio/*" hidden></div>' +
    '</div></div>';

  var $ = function (id) { return document.getElementById(id); };
  var el = $('player');
  var eqBars = [].slice.call(el.querySelectorAll('.eq i'));

  /* ---------- state ---------- */
  var style = 'lofi', tempoShift = 0, volume = 0.7;
  try {
    var saved = JSON.parse(localStorage.getItem('focus.player') || '{}');
    if (STYLES[saved.style]) style = saved.style;
    if (typeof saved.vol === 'number') volume = saved.vol;
    if (typeof saved.tempo === 'number') tempoShift = saved.tempo;
  } catch (e) {}
  function save() { try { localStorage.setItem('focus.player', JSON.stringify({ style: style, vol: volume, tempo: tempoShift })); } catch (e) {} }

  var history = [], hIndex = -1, track = null, upcoming = null;
  var ctx = null, master, comp, analyser, verb, verbGain, dry, noiseBuf, crackleSrc, rainSrc, rainGain, crackleGain;
  var playing = false, timer = 0, nextStep = 0, step = 0, startedAt = 0, elapsed = 0;
  var fileEl = null, fileNode = null, fileName = '';

  function makeTrack(seed, styleKey) {
    var r = rng(seed), s = STYLES[styleKey];
    var bpm = Math.round(s.bpm[0] + r() * (s.bpm[1] - s.bpm[0]));
    return {
      seed: seed, style: styleKey, bpm: bpm,
      root: Math.floor(r() * 12),
      prog: pick(r, PROGS),
      // word indices, not text: the title is worded per language (same rng draws as picking the words)
      adj: Math.floor(r() * ADJ.length), noun: Math.floor(r() * NOUN.length),
      len: Math.round(120 + r() * 90),
      r: r
    };
  }

  /* ---------- audio graph ---------- */
  function ensureCtx() {
    if (ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = volume;
    comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    analyser = ctx.createAnalyser(); analyser.fftSize = 64;
    dry = ctx.createGain();
    verb = ctx.createConvolver(); verbGain = ctx.createGain();
    verb.buffer = impulse(2.6);
    dry.connect(comp); verb.connect(verbGain); verbGain.connect(comp);
    comp.connect(master); master.connect(analyser); analyser.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  function impulse(sec) {
    var len = ctx.sampleRate * sec, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var ch = buf.getChannelData(c);
      for (var i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
    }
    return buf;
  }
  function send(node, wet) { // route a voice to the dry bus and the reverb
    node.connect(dry);
    var g = ctx.createGain(); g.gain.value = wet; node.connect(g); g.connect(verb);
  }
  function hz(semi) { return 440 * Math.pow(2, (semi - 9) / 12); } // semitones from C4

  function voice(freq, t, dur, opts) {
    var o = ctx.createOscillator(), o2 = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = opts.wave; o2.type = opts.wave;
    o.frequency.value = freq; o2.frequency.value = freq; o2.detune.value = opts.detune || 7;
    f.type = 'lowpass'; f.frequency.value = opts.cutoff; f.Q.value = 0.7;
    var a = opts.attack || 0.02, rel = opts.release || 0.4, peak = opts.gain;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.setValueAtTime(peak, t + Math.max(a, dur - rel));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + rel);
    o.connect(f); o2.connect(f); f.connect(g); send(g, opts.wet);
    o.start(t); o2.start(t); o.stop(t + dur + rel + 0.05); o2.stop(t + dur + rel + 0.05);
  }
  function noiseHit(t, dur, type, freq, gain, wet) {
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; f.type = type; f.frequency.value = freq;
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); send(g, wet || 0.05);
    s.start(t, Math.random()); s.stop(t + dur + 0.02);
  }
  function kick(t, gain) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    o.connect(g); g.connect(dry); o.start(t); o.stop(t + 0.35);
  }
  function loopNoise(type, freq, gain) {
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; s.loop = true; f.type = type; f.frequency.value = freq; g.gain.value = gain;
    s.connect(f); f.connect(g); g.connect(dry); s.start();
    return { src: s, gain: g };
  }

  /* ---------- sequencer ---------- */
  function bpmNow() { return Math.max(40, track.bpm + tempoShift); }
  function scheduleStep(t) {
    var s = STYLES[track.style], r = track.r, sixteenth = 60 / bpmNow() / 4;
    var bar = Math.floor(step / 16), pos = step % 16;
    var chord = track.prog[bar % 4], base = track.root - 12;
    if (pos === 0) {
      chord.forEach(function (n) {
        voice(hz(base + n), t, sixteenth * 16, { wave: s.wave, cutoff: s.cutoff, gain: 0.05 * s.pad, attack: s.name === 'ambient' ? 1.2 : 0.04, release: s.name === 'ambient' ? 2 : 0.5, wet: s.verb });
      });
    }
    if (pos === 0 || (pos === 8 && s.drums)) {
      voice(hz(base - 12 + chord[0]), t, sixteenth * 7, { wave: 'sine', cutoff: 600, gain: 0.16, attack: 0.01, release: 0.2, wet: 0.05 });
    }
    if (s.arp && pos % 2 === 0) {
      voice(hz(track.root + chord[(pos / 2) % 4]), t, sixteenth * 1.6, { wave: 'square', cutoff: 2200, gain: 0.025, attack: 0.005, release: 0.08, wet: 0.25 });
    }
    // melody from the minor pentatonic over the current chord
    var lead = [0, 3, 5, 7, 10, 12, 15];
    if (r() < (s.name === 'ambient' ? 0.08 : 0.2) && pos % 2 === 0) {
      voice(hz(track.root + 12 + pick(r, lead)), t, sixteenth * (s.name === 'ambient' ? 6 : 2.5),
        { wave: s.name === 'synth' ? 'square' : 'sine', cutoff: 3000, gain: 0.05 * s.lead, attack: 0.01, release: s.name === 'ambient' ? 1.6 : 0.5, wet: s.verb + 0.15 });
    }
    if (s.drums === 'lofi') {
      if (pos === 0 || pos === 10) kick(t, 0.5);
      if (pos === 4 || pos === 12) noiseHit(t, 0.18, 'bandpass', 1800, 0.22, 0.12);
      if (pos % 2 === 0) noiseHit(t + (pos % 4 === 2 ? sixteenth * s.swing * 4 : 0), 0.05, 'highpass', 7000, 0.06);
    } else if (s.drums === 'synth') {
      if (pos % 4 === 0) kick(t, 0.45);
      if (pos === 4 || pos === 12) noiseHit(t, 0.2, 'bandpass', 2200, 0.2, 0.2);
      if (pos % 2 === 1) noiseHit(t, 0.04, 'highpass', 8000, 0.05);
    }
    step += 1;
  }
  function scheduler() {
    while (nextStep < ctx.currentTime + 0.15) {
      scheduleStep(nextStep);
      nextStep += 60 / bpmNow() / 4;
    }
  }

  function startAmbience() {
    stopAmbience();
    var s = STYLES[track.style];
    if (s.crackle) { crackleSrc = loopNoise('highpass', 5000, 0.012); }
    if (s.rain) { rainSrc = loopNoise('lowpass', 900, 0.09); }
  }
  function stopAmbience() {
    [crackleSrc, rainSrc].forEach(function (n) { if (n) { try { n.src.stop(); } catch (e) {} } });
    crackleSrc = rainSrc = null;
  }

  /* ---------- transport ---------- */
  function load(t, keepPlaying) {
    track = t;
    step = 0; elapsed = 0;
    swapInfo();
    paintStyle();
    if (keepPlaying && playing) { stopFile(); startGen(); }
    draw();
  }
  function fromHistory(i) { var h = history[i].split(':'); return makeTrack(+h[0], h[1]); }
  // what next() plays: forward through history after going back, otherwise the pre-generated track
  function upNext() {
    if (hIndex < history.length - 1) return fromHistory(hIndex + 1);
    if (!upcoming) upcoming = makeTrack(seed(), style);
    return upcoming;
  }
  function newTrack(t) { // play t (or a fresh track) and line up a new upcoming one
    t = t || makeTrack(seed(), style);
    history = history.slice(0, hIndex + 1); history.push(t.seed + ':' + t.style); hIndex = history.length - 1;
    upcoming = makeTrack(seed(), style);
    load(t, true);
  }
  function advance() {
    if (hIndex < history.length - 1) { hIndex += 1; load(fromHistory(hIndex), true); }
    else newTrack(upNext());
  }
  function startGen() {
    ensureCtx();
    if (ctx.state === 'suspended') ctx.resume();
    nextStep = ctx.currentTime + 0.06;
    startedAt = ctx.currentTime - elapsed;
    startAmbience();
    clearInterval(timer);
    timer = setInterval(scheduler, 25);
  }
  function stopGen() {
    clearInterval(timer); timer = 0;
    stopAmbience();
    if (ctx) elapsed = ctx.currentTime - startedAt;
  }
  function play() {
    if (!track) advance();
    playing = true;
    if (fileEl) { ensureCtx(); ctx.resume(); fileEl.play(); } else startGen();
    draw();
  }
  function pause() {
    playing = false;
    if (fileEl) fileEl.pause(); else stopGen();
    draw();
  }
  function next() { stopFile(); if (playing) stopGen(); advance(); }
  function prev() {
    stopFile();
    if (playing) stopGen();
    if (currentTime() > 4 || hIndex <= 0) { elapsed = 0; step = 0; if (playing) startGen(); draw(); return; }
    hIndex -= 1;
    load(fromHistory(hIndex), true);
  }
  function currentTime() {
    if (fileEl) return fileEl.currentTime || 0;
    if (!ctx) return 0;
    return playing ? ctx.currentTime - startedAt : elapsed;
  }

  /* own file: plays through the same output so the meter still moves */
  function playFile(file) {
    ensureCtx();
    stopGen();
    stopFile();
    fileEl = new Audio();
    fileEl.src = URL.createObjectURL(file);
    fileNode = ctx.createMediaElementSource(fileEl);
    fileNode.connect(master);
    fileEl.addEventListener('ended', function () { next(); });
    fileName = file.name.replace(/\.[^.]+$/, '');
    swapInfo();
    playing = true;
    ctx.resume();
    fileEl.play();
    paintStyle();
    draw();
  }
  function stopFile() {
    if (!fileEl) return;
    fileEl.pause();
    try { fileNode.disconnect(); } catch (e) {}
    URL.revokeObjectURL(fileEl.src);
    fileEl = null; fileNode = null;
  }

  /* ---------- view ---------- */
  function titleOf(t) {
    var adj = T('np.adj', ADJ.join(',')).split(','), noun = T('np.noun', NOUN.join(',')).split(',');
    return T('np.title', '{adj} {noun}').replace('{adj}', adj[t.adj]).replace('{noun}', noun[t.noun]);
  }
  var swapTimer = 0;
  // the text swap lasts as long as the CSS fade (--duration-quick), read once from the stylesheet
  var swapMs = still ? 0 : (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--duration-quick')) || 150);
  function swapInfo() {
    var lines = [$('np-title'), $('np-artist'), $('np-up')];
    lines.forEach(function (l) { l.classList.add('swap'); });
    // one swap at a time: a quick double skip shows only the last track, without a flicker between
    clearTimeout(swapTimer);
    swapTimer = setTimeout(function () {
      paintInfo();
      lines.forEach(function (l) { l.classList.remove('swap'); });
    }, swapMs);
  }
  function paintInfo() {
    var meta = T('np.gen', 'generated live &middot; no copyright');
    if (fileEl) meta = T('np.file', 'your file &middot; plays on this device only');
    else if (track) meta = T('np.s.' + track.style, track.style) + ' &middot; ' + NOTES[track.root] + ' ' + T('np.minor', 'minor') + ' &middot; ' + meta;
    $('np-artist').innerHTML = meta;
    marquee($('np-title'), fileEl ? fileName : track ? titleOf(track) : T('np.press', 'press play'));
    marquee($('np-up'), T('np.up', 'up next') + ': ' + titleOf(upNext()));
  }
  // long lines glide back and forth only when they overflow their box; reduced motion keeps the ellipsis.
  // New text restarts the glide (it happens while the line is faded out); a refit with the same text doesn't.
  function marquee(box, text) {
    var span = box.firstChild;
    if (span.textContent === text) { fit(box); return; }
    span.textContent = text;
    box.classList.remove('run');
    fit(box);
  }
  function fit(box) {
    var over = Math.ceil(box.firstChild.scrollWidth - box.clientWidth); // same in both states, no need to stop it to measure
    if (over <= 1 || still) { box.classList.remove('run'); box._over = 0; return; }
    if (box._over === over && box.classList.contains('run')) return;
    box._over = over;
    // each glide ~40px/s, at least 1.6s; the two glides take 60% of the loop (style.css @keyframes mq), holds the rest
    var glide = Math.max(1.6, over / 40);
    box.style.setProperty('--mq-x', -over + 'px');
    box.style.setProperty('--mq-t', (glide * 2 / 0.6).toFixed(2) + 's');
    box.classList.add('run');
  }
  function refit() { fit($('np-title')); fit($('np-up')); }
  function paintText() {
    $('np-head').textContent = T('np.now', 'now playing');
    $('np-styles').setAttribute('aria-label', T('np.style', 'Style'));
    [].forEach.call(el.querySelectorAll('[data-style]'), function (c) { var k = c.getAttribute('data-style'); c.textContent = T('np.s.' + k, k); });
    $('np-tempo-l').textContent = T('np.tempo', 'tempo');
    $('np-tempo').setAttribute('aria-label', T('np.tempolbl', 'Tempo'));
    $('np-vol-l').textContent = T('np.vol', 'volume');
    $('np-vol').setAttribute('aria-label', T('np.vollbl', 'Volume'));
    $('np-file-btn').textContent = T('np.own', '+ play your own file');
    $('np-prev').setAttribute('aria-label', T('np.prev', 'Previous track'));
    $('np-next').setAttribute('aria-label', T('np.next', 'Next random track'));
  }
  function paintStyle() {
    [].forEach.call(el.querySelectorAll('[data-style]'), function (c) {
      var on = !fileEl && c.getAttribute('data-style') === style;
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    $('np-bpm').textContent = track && !fileEl ? bpmNow() + ' bpm' : '— bpm';
  }
  // writes only what changed: the clock text once a second, the bar as a compositor-only scaleX
  var shown = {}, posEl = $('np-pos'), lenEl = $('np-len'), fillEl = $('np-fill'), ppEl = $('np-play');
  function put(key, val, fn) { if (shown[key] !== val) { shown[key] = val; fn(val); } }
  function draw() {
    syncLoop();
    var len = fileEl ? (fileEl.duration || 0) : (track ? track.len : 0);
    var pos = currentTime();
    put('pos', clock(pos), function (v) { posEl.textContent = v; });
    put('len', clock(len), function (v) { lenEl.textContent = v; });
    put('fill', len ? Math.min(1, pos / len).toFixed(4) : '0', function (v) { fillEl.style.transform = 'scaleX(' + v + ')'; });
    put('pp', playing, function (v) { ppEl.innerHTML = v ? '&#10074;&#10074;' : '&#9654;'; el.classList.toggle('playing', v); });
    put('ppl', playing ? T('np.pause', 'Pause') : T('np.play', 'Play'), function (v) { ppEl.setAttribute('aria-label', v); });
  }

  // the frame loop runs only while music plays; it skips the DOM while the player is off screen
  // (the track-end check still runs) and stops when paused. Hidden tabs pause the music anyway.
  var freq = new Uint8Array(32), levels = eqBars.map(function () { return 0.3; }), looping = false, onScreen = true;
  function frame() {
    if (!playing) { looping = false; return; }
    if (!fileEl && track && currentTime() >= track.len) next();
    if (onScreen) {
      if (analyser && !still) {
        analyser.getByteFrequencyData(freq);
        eqBars.forEach(function (b, i) {
          var target = 0.15 + freq[2 + i * 3] / 255 * 0.85;
          levels[i] += (target - levels[i]) * (target > levels[i] ? 0.6 : 0.2); // quick rise, softer fall
          b.style.transform = 'scaleY(' + levels[i].toFixed(3) + ')';
        });
      }
      draw();
    }
    requestAnimationFrame(frame);
  }
  function syncLoop() {
    if (playing) { if (!looping) { looping = true; requestAnimationFrame(frame); } return; }
    // paused: hand the bars back to CSS, which eases them down
    eqBars.forEach(function (b, i) { b.style.transform = ''; levels[i] = 0.3; });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { onScreen = es[es.length - 1].isIntersecting; if (onScreen) draw(); }).observe(el);
  }

  /* ---------- controls ---------- */
  $('np-play').addEventListener('click', function () { playing ? pause() : play(); });
  $('np-next').addEventListener('click', function () { next(); if (!playing) play(); });
  $('np-prev').addEventListener('click', prev);
  $('np-track').addEventListener('click', function (e) {
    var rect = this.getBoundingClientRect(), p = (e.clientX - rect.left) / rect.width;
    if (fileEl && fileEl.duration) { fileEl.currentTime = p * fileEl.duration; return; }
    if (!track) return;
    elapsed = p * track.len; step = Math.floor(elapsed / (60 / bpmNow() / 4));
    if (playing) { stopGen(); elapsed = p * track.len; startGen(); }
  });
  [].forEach.call(el.querySelectorAll('[data-style]'), function (c) {
    c.addEventListener('click', function () {
      style = c.getAttribute('data-style'); save();
      stopFile(); if (playing) stopGen();
      newTrack();
      if (!playing) play();
    });
  });
  $('np-tempo').value = tempoShift;
  $('np-tempo').addEventListener('input', function () { tempoShift = +this.value; save(); paintStyle(); });
  $('np-vol').value = Math.round(volume * 100);
  $('np-volv').textContent = Math.round(volume * 100) + '%';
  $('np-vol').addEventListener('input', function () {
    volume = this.value / 100; save();
    $('np-volv').textContent = this.value + '%';
    if (master) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
  });
  $('np-file-btn').addEventListener('click', function () { $('np-file').click(); });
  $('np-file').addEventListener('change', function () { if (this.files && this.files[0]) playFile(this.files[0]); this.value = ''; });
  document.addEventListener('visibilitychange', function () { if (document.hidden && playing && !fileEl) pause(); });
  document.addEventListener('langchange', function () { paintText(); paintInfo(); });
  // width changes only: mobile toolbars fire resize while scrolling, which would restart the scroll
  var fitW = innerWidth, fitTimer = 0;
  addEventListener('resize', function () {
    if (innerWidth === fitW) return;
    fitW = innerWidth; clearTimeout(fitTimer); fitTimer = setTimeout(refit, 150);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);

  paintText();
  paintInfo();
  paintStyle();
  draw();
})();
