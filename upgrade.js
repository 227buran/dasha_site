(() => {
  const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  // ===== Живые лепестки сакуры + салют из сердец (один canvas) =====
  const pc = document.createElement('canvas'); pc.id = 'petalCanvas'; document.body.appendChild(pc);
  const g = pc.getContext('2d'); let W, H; const dpr = Math.min(devicePixelRatio || 1, 2);
  const rs = () => { W = innerWidth; H = innerHeight; pc.width = W * dpr; pc.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
  rs(); addEventListener('resize', rs);
  const mk = (x, y) => ({ x, y, z: .4 + Math.random() * .9, r: Math.random() * 6.28, vr: (Math.random() - .5) * .03, ph: Math.random() * 6.28, c: Math.random() });
  const P = reduce ? [] : Array.from({ length: 30 }, () => mk(Math.random() * innerWidth, Math.random() * innerHeight));
  let B = [], wind = 0, tw = 0, lastY = scrollY;
  addEventListener('mousemove', e => tw = (e.clientX / W - .5) * 1.6);
  window.burst = (x, y, n = 36) => {
    const cols = ['#f4c9d3', '#e0587c', '#e8c892'];
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = 2 + Math.random() * 6; B.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 3, l: 1, s: 10 + Math.random() * 16, c: cols[i % 3] }); }
  };
  (function loop() {
    g.clearRect(0, 0, W, H);
    const dy = scrollY - lastY; lastY = scrollY; wind += (tw - wind) * .02;
    for (let i = P.length; i--;) { const p = P[i];
      p.y += .6 + p.z * .9 + Math.abs(dy) * .15 * p.z; p.x += Math.sin(p.ph) * .4 + wind * p.z * 1.5; p.r += p.vr; p.ph += .02;
      if (p.y > H + 20 || p.x < -30 || p.x > W + 30) { if (p.s) { P.splice(i, 1); continue; } Object.assign(p, mk(Math.random() * W, -20)); }
      g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.scale(p.z, p.z * (.35 + .65 * Math.abs(Math.cos(p.ph))));
      g.fillStyle = p.c > .5 ? 'rgba(244,201,211,.75)' : 'rgba(224,88,124,.55)';
      g.beginPath(); g.moveTo(0, -9); g.bezierCurveTo(9, -8, 9, 6, 0, 10); g.bezierCurveTo(-9, 6, -9, -8, 0, -9); g.fill(); g.restore();
    }
    B = B.filter(b => b.l > 0);
    for (const b of B) { b.x += b.vx; b.y += b.vy; b.vy += .12; b.vx *= .99; b.l -= .012; g.globalAlpha = Math.max(b.l, 0); g.fillStyle = b.c; g.font = b.s + 'px serif'; g.fillText('♥', b.x, b.y); }
    g.globalAlpha = 1; requestAnimationFrame(loop);
  })();

  // салют при каждом пройденном испытании и при комплименте
  const _sp = window.saveProgress;
  window.saveProgress = function () { _sp(); burst(innerWidth / 2, innerHeight / 2, 70); dispatchEvent(new Event('dasha-cheer')); };
  const cb = $('#complimentBtn'); if (cb) cb.addEventListener('click', e => burst(e.clientX, e.clientY, 24));

  // ===== Заголовок по буквам =====
  const ht = $('.hero-title');
  if (ht) { const t = ht.textContent; ht.setAttribute('aria-label', t); ht.innerHTML = [...t].map((c, i) => `<span class="ch" aria-hidden="true" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join(''); }

  // ===== Прогресс прокрутки и линия таймлайна =====
  const stops = [[0, [11, 6, 14]], [.3, [22, 10, 28]], [.55, [17, 20, 14]], [.8, [34, 14, 26]], [1, [46, 20, 22]]];
  const bgAt = p => { for (let i = 1; i < stops.length; i++) if (p <= stops[i][0]) { const [a, A] = stops[i - 1], [b, B] = stops[i], k = (p - a) / (b - a); return A.map((v, j) => Math.round(v + (B[j] - v) * k)); } return stops[stops.length - 1][1]; };
  const bar = $('.scroll-progress'), tl = $('.timeline');
  const onScroll = () => {
    const h = document.documentElement; const pr = Math.min(1, scrollY / ((h.scrollHeight - innerHeight) || 1)); bar.style.transform = `scaleX(${pr})`; document.body.style.background = `rgb(${bgAt(pr)})`;
    if (tl) { const r = tl.getBoundingClientRect(); tl.style.setProperty('--tl', Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height))); }
  };
  addEventListener('scroll', onScroll, { passive: true });
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('on')), { threshold: .5 });
  $$('.timeline-item').forEach(i => io.observe(i));

  // ===== 3D-наклон карточек за курсором =====
  if (matchMedia('(pointer:fine)').matches && !reduce) {
    $$('.tile,.game-card,.counter-item,.diff-card').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(700px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateY(-6px)`;
        el.style.setProperty('--mx', (x + .5) * 100 + '%'); el.style.setProperty('--my', (y + .5) * 100 + '%');
      });
      el.addEventListener('pointerleave', () => el.style.transform = '');
    });
  }

  // ===== Месяцы вместе и сколько до следующего =====
  const pl = (n, f) => f[n % 10 === 1 && n % 100 !== 11 ? 0 : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 1 : 2];
  const ml = $('#monthsLine');
  if (ml) {
    const s = startDate, n = new Date(); let m = (n.getFullYear() - s.getFullYear()) * 12 + n.getMonth() - s.getMonth();
    const at = k => { const d = new Date(s); d.setMonth(s.getMonth() + k); return d; };
    if (at(m) > n) m--;
    const d = Math.floor((n - at(m)) / 864e5), left = Math.ceil((at(m + 1) - n) / 864e5);
    ml.textContent = `Это ${m} ${pl(m, ['месяц', 'месяца', 'месяцев'])} и ${d} ${pl(d, ['день', 'дня', 'дней'])}. До следующего месяца вместе — ${left} ${pl(left, ['день', 'дня', 'дней'])}.`;
  }

  // ===== Сердце из звёзд в финале =====
  const cv = $('#constellation');
  if (cv) {
    const c = cv.getContext('2d'), w = cv.width, h = cv.height, K = 8.5;
    const pts = Array.from({ length: 70 }, (_, i) => { const t = i / 70 * 6.2832; return { x: w / 2 + 16 * Math.pow(Math.sin(t), 3) * K, y: h / 2 + 8 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * K, d: Math.random() * 6 }; });
    let t0 = 0, go = false;
    new IntersectionObserver(([e]) => { if (e.isIntersecting && !go) { go = true; t0 = performance.now(); } }, { threshold: .5 }).observe(cv);
    cv.addEventListener('click', e => burst(e.clientX, e.clientY, 30));
    (function draw(now) {
      c.clearRect(0, 0, w, h);
      if (go) {
        const k = Math.min(1, (now - t0) / 3500), n = Math.floor(k * pts.length), v = pts.slice(0, n);
        c.shadowBlur = 0; c.strokeStyle = 'rgba(244,201,211,.35)'; c.beginPath();
        v.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)); if (k === 1) c.closePath(); c.stroke();
        c.shadowColor = '#e8c892'; c.shadowBlur = 10; c.fillStyle = '#fff6e8';
        v.forEach(p => { c.beginPath(); c.arc(p.x, p.y, 1.8 + 1.2 * Math.sin(now / 500 + p.d), 0, 6.28); c.fill(); });
        if (k === 1) { c.shadowBlur = 0; c.fillStyle = '#f4c9d3'; c.font = 'italic 600 32px "Cormorant Garamond",serif'; c.textAlign = 'center'; c.fillText('ты и я', w / 2, h / 2 + 12); }
      }
      requestAnimationFrame(draw);
    })(0);
  }

  // ===== «Маленькие факты»: нажми — откроются слова =====
  const ov = document.createElement('div'); ov.className = 'reveal';
  ov.innerHTML = '<div class="reveal-card" role="dialog" aria-modal="true"><div class="reveal-icon"></div><h3></h3><p></p><button class="reveal-close">Закрыть</button></div>';
  document.body.appendChild(ov);
  const closeR = () => ov.classList.remove('open');
  ov.addEventListener('click', e => { if (e.target === ov || e.target.classList.contains('reveal-close')) closeR(); });
  addEventListener('keydown', e => e.key === 'Escape' && closeR());
  $$('.tile').forEach(t => t.addEventListener('click', e => {
    ov.querySelector('.reveal-icon').textContent = t.querySelector('.tile-icon').textContent;
    ov.querySelector('h3').textContent = t.querySelector('.tile-text').textContent;
    ov.querySelector('p').innerHTML = t.dataset.words.split(' ').map((w, i) => `<span style="--i:${i}">${w}</span>`).join('');
    ov.classList.add('open'); ov.querySelector('.reveal-close').focus(); burst(e.clientX, e.clientY, 14);
  }));

  // ===== Навигация: подсветка текущего раздела =====
  const links = [...$$('.topnav a')];
  const so = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id))), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const t = $(a.getAttribute('href')); t && so.observe(t); });

  // ===== Цветущие ветви сакуры в шапке =====
  const tc = $('#treeCanvas'), hero = $('.hero');
  if (tc && hero) {
    const x = tc.getContext('2d');
    const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647);
    const sprite = (c1, c2) => { const o = document.createElement('canvas'); o.width = o.height = 64; const q = o.getContext('2d'); q.translate(32, 32);
      for (let k = 0; k < 5; k++) { q.save(); q.rotate(k * 1.2566); const gr = q.createRadialGradient(0, -14, 1, 0, -14, 16); gr.addColorStop(0, c1); gr.addColorStop(1, c2); q.fillStyle = gr; q.beginPath(); q.ellipse(0, -14, 9, 15, 0, 0, 6.2832); q.fill(); q.restore(); }
      q.fillStyle = '#e8c892'; q.beginPath(); q.arc(0, 0, 3, 0, 6.2832); q.fill(); return o; };
    const SP = [sprite('#fff1f4', '#f4a9bf'), sprite('#ffd9e3', '#e0587c')];
    let segs = [], blooms = [], t0 = 0, vis = false, cw = 0, ch = 0;
    const bl = (R, px, py, t) => blooms.push({ x: px, y: py, t, r: 26 + R() * 18, a: R() * 6.28, k: R() < .6 ? 0 : 1, ph: R() * 6.28 });
    const grow = (R, px, py, a, len, w, d, t) => {
      const x2 = px + Math.cos(a) * len, y2 = py + Math.sin(a) * len, dur = len * 6;
      segs.push({ x: px, y: py, x2, y2, w, t, dur });
      if (d < 4 && R() < .55) bl(R, px + (x2 - px) * .6, py + (y2 - py) * .6, t + dur * .6);
      if (d === 0 || len < 14) { bl(R, x2, y2, t + dur); return; }
      const n = d > 3 ? 2 : (R() < .6 ? 2 : 3);
      for (let i = 0; i < n; i++) grow(R, x2, y2, a + (i - (n - 1) / 2) * (.45 + R() * .3) + (1.5708 - a) * .1, len * (.72 + R() * .1), w * .68, d - 1, t + dur);
    };
    const build = () => {
      cw = hero.clientWidth; ch = hero.clientHeight; tc.width = cw * dpr; tc.height = ch * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      segs = []; blooms = []; const R = rnd(11), L = Math.min(cw * .17, 260), wd = Math.max(5, L / 22);
      grow(R, -20, ch * .06, .5, L, wd, 6, 0); grow(R, cw + 20, ch * .1, Math.PI - .5, L, wd, 6, 400);
    };
    build(); addEventListener('resize', build);
    new IntersectionObserver(([e]) => vis = e.isIntersecting).observe(hero);
    (function frame(now) {
      if (vis) {
        if (!t0 && hero.classList.contains('visible')) t0 = now;
        x.clearRect(0, 0, cw, ch);
        if (t0) {
          const el = now - t0; x.lineCap = 'round'; x.strokeStyle = '#6a3a5a';
          for (const s of segs) { const p = Math.min(1, (el - s.t) / s.dur); if (p <= 0) continue; x.lineWidth = s.w; x.beginPath(); x.moveTo(s.x, s.y); x.lineTo(s.x + (s.x2 - s.x) * p, s.y + (s.y2 - s.y) * p); x.stroke(); }
          for (const b of blooms) {
            const e = Math.min(1, (el - b.t) / 900); if (e <= 0) continue;
            const k = (1 + 2.7 * (e - 1) ** 3 + 1.7 * (e - 1) ** 2) * b.r / 32;
            x.save(); x.translate(b.x + Math.sin(now / 1200 + b.ph) * 1.5, b.y + Math.cos(now / 1500 + b.ph) * 1.2); x.rotate(b.a + Math.sin(now / 2000 + b.ph) * .15); x.scale(k, k); x.drawImage(SP[b.k], -32, -32); x.restore();
            if (e === 1 && Math.random() < .0002 && P.length < 70) { const r = tc.getBoundingClientRect(); P.push({ ...mk(r.left + b.x, r.top + b.y), s: 1 }); }
          }
        }
      }
      requestAnimationFrame(frame);
    })(0);
    // свет за курсором в шапке
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); hero.style.setProperty('--sx', e.clientX - r.left + 'px'); hero.style.setProperty('--sy', e.clientY - r.top + 'px'); });
    // секрет: нажми на заголовок — лепестковая буря
    if (ht) ht.addEventListener('click', e => { for (let i = 0; i < 60; i++) P.push({ ...mk(Math.random() * W, -20 - Math.random() * 300), s: 1 }); burst(e.clientX, e.clientY, 30); });
  }

  // ===== Фоновая музыка (генерируется прямо в браузере) =====
  const mb = document.createElement('button'); mb.className = 'music-btn'; mb.textContent = '♪'; mb.setAttribute('aria-label', 'Включить музыку'); document.body.appendChild(mb);
  let ac, master, iv, step = 0;
  const chords = [[220, 261.63, 329.63], [174.61, 220, 261.63], [261.63, 329.63, 392], [196, 246.94, 293.66]], sc = [261.63, 293.66, 329.63, 392, 440];
  const note = (f, t, d, v, type) => { const o = ac.createOscillator(), g2 = ac.createGain(); o.type = type; o.frequency.value = f; g2.gain.setValueAtTime(0, t); g2.gain.linearRampToValueAtTime(v, t + .04); g2.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g2); g2.connect(master); o.start(t); o.stop(t + d + .1); };
  const playBar = () => { const t = ac.currentTime + .05, c = chords[step++ % 4]; c.forEach(f => note(f / 2, t, 4.2, .05, 'triangle'));
    for (let i = 0; i < 4; i++) if (Math.random() < .75) note(sc[Math.random() * sc.length | 0] * (Math.random() < .25 ? 2 : 1), t + i + Math.random() * .3, 2.4, .085, 'sine'); };
  mb.addEventListener('click', () => {
    const on = mb.classList.toggle('on'); mb.setAttribute('aria-label', on ? 'Выключить музыку' : 'Включить музыку');
    if (on) {
      if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = .55; const dl = ac.createDelay(1), fb = ac.createGain(); dl.delayTime.value = .45; fb.gain.value = .4; master.connect(ac.destination); master.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(ac.destination); }
      ac.resume(); playBar(); iv = setInterval(playBar, 4000);
    } else { clearInterval(iv); master.gain.setTargetAtTime(0, ac.currentTime, .3); setTimeout(() => master.gain.value = .55, 6000); }
  });

  // ===== Ступенчатое появление карточек =====
  $$('.tiles-grid,.me-grid,.games-grid,.stats-grid').forEach(g => [...g.children].forEach((el, i) => el.style.setProperty('--n', i)));

  // ===== Мини-Даша: её можно таскать, она моргает, следит за курсором и болтает =====
  const AV = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M10 72C6 22 38 4 60 4s54 18 50 68l4 70c-14 10-30 2-34-20H40c-4 22-20 30-34 20z" fill="#161826"/>
<rect x="50" y="96" width="20" height="24" rx="8" fill="#f1d3c4"/>
<path d="M20 150c3-24 22-36 40-36s37 12 40 36z" fill="#fff"/>
<g fill="#d23a45" font-size="11"><text x="32" y="136">♥</text><text x="52" y="146">♥</text><text x="74" y="134">♥</text><text x="88" y="147">♥</text></g>
<ellipse cx="60" cy="66" rx="35" ry="37" fill="#f8e1d6"/>
<path d="M24 64C24 30 46 20 62 22c26 2 36 22 34 42-8-18-22-26-40-24-14 2-26 10-32 24z" fill="#161826"/>
<path d="M12 80c-4 30 0 52 10 64 12-8 14-28 10-52z" fill="#161826"/><path d="M108 80c4 30 0 52-10 64-12-8-14-28-10-52z" fill="#161826"/>
<ellipse cx="33" cy="87" rx="6" ry="3.5" fill="#f08ca0" opacity=".35"/><ellipse cx="87" cy="87" rx="6" ry="3.5" fill="#f08ca0" opacity=".35"/>
<g class="eyes"><g class="eye"><circle cx="43" cy="70" r="5.5" fill="#46564f"/><circle cx="41.5" cy="68" r="1.7" fill="#fff"/></g><g class="eye"><circle cx="77" cy="70" r="5.5" fill="#46564f"/><circle cx="75.5" cy="68" r="1.7" fill="#fff"/></g></g>
<g fill="rgba(255,255,255,.16)" stroke="#0b0b10" stroke-width="3.2"><circle cx="43" cy="70" r="15"/><circle cx="77" cy="70" r="15"/><path d="M58 68q2-3 4 0" fill="none"/></g>
<path d="M58 84q2 2 4 0" stroke="#e5b7a5" fill="none" stroke-width="1.5"/>
<path d="M52 93q8 7 16 0q-8-3-16 0z" fill="#d77d90"/><path d="M55 93q5-2 10 0" stroke="#fff" stroke-width="1.2" opacity=".7" fill="none"/>
</svg>`;
  const md = document.createElement('div'); md.className = 'mini'; md.setAttribute('aria-label', 'Мини-Даша'); md.innerHTML = '<div class="mini-bubble"></div>' + AV; document.body.appendChild(md);
  const bub = md.querySelector('.mini-bubble'), eyesEl = [...md.querySelectorAll('.eye')];
  const say = (t, ms = 3800) => { md.classList.toggle('right', md.getBoundingClientRect().left > innerWidth / 2); bub.textContent = t; bub.classList.add('on'); clearTimeout(say.t); say.t = setTimeout(() => bub.classList.remove('on'), ms); };
  const talk = ['Нажми на меня ещё раз 😄', 'Он написал всё это прямо в коде. Серьёзно!', 'Проходи все игры — там тебя ждёт сюрприз 🎁', 'Пепси мне не наливай, это не моё 🥤', 'Двигай меня куда захочешь!', 'Он тебя очень-очень любит ❤️', 'Попробуй тетрис, он коварный 😉', 'Тссс… нажми на большое «Для Даши» 🌸'];
  let drag = false, moved = false, ox = 0, oy = 0, ti = 0;
  md.addEventListener('pointerdown', e => { drag = true; moved = false; const r = md.getBoundingClientRect(); ox = e.clientX - r.left; oy = e.clientY - r.top; md.setPointerCapture(e.pointerId); md.classList.add('drag'); });
  md.addEventListener('pointermove', e => { if (!drag) return; moved = true; md.style.left = Math.min(innerWidth - md.offsetWidth, Math.max(0, e.clientX - ox)) + 'px'; md.style.top = Math.min(innerHeight - md.offsetHeight, Math.max(0, e.clientY - oy)) + 'px'; md.style.bottom = 'auto'; });
  md.addEventListener('pointerup', e => {
    drag = false; md.classList.remove('drag');
    if (moved) { md.classList.add('land'); setTimeout(() => md.classList.remove('land'), 500); say('Ой! Тут тоже неплохо 💕', 2200); }
    else { say(talk[ti++ % talk.length]); burst(e.clientX, e.clientY, 14); }
  });
  addEventListener('pointermove', e => {
    const r = md.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * .45, a = Math.atan2(e.clientY - cy, e.clientX - cx), d = Math.min(3.2, Math.hypot(e.clientX - cx, e.clientY - cy) / 60);
    eyesEl.forEach(el => el.style.transform = `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px)`);
  });
  addEventListener('dasha-cheer', () => { md.classList.add('cheer'); say('Ураа! Ты молодец! 🎉', 3000); setTimeout(() => md.classList.remove('cheer'), 1300); });
  new MutationObserver(() => { if (!document.body.classList.contains('intro-active')) setTimeout(() => say('Привет! Я мини-Даша. Таскай меня куда хочешь 💕', 5000), 1500); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
