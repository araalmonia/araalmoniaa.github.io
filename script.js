(function () {
  window.__fxReady = true;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/
  var year = document.getElementById('year');
  if (year && !year.textContent) year.textContent = new Date().getFullYear();

  var bar = document.getElementById('progress');
  var header = document.querySelector('.site-header');
  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var targets = document.querySelectorAll(
    'section h2, #about > .container > p, .skill-list, .technology-list, .project-grid, .contact, #contacts > p'
  );

  document.querySelectorAll('.skill-list, .technology-list, .project-grid').forEach(function (group) {
    group.querySelectorAll(':scope > li, :scope > .card').forEach(function (item, i) {
      item.style.setProperty('--i', i);
    });
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    targets.forEach(function (el) {
      if (!el.matches('.skill-list, .technology-list, .project-grid, #contacts > p')) el.classList.add('reveal');
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add('visible'); });
  }

  var links = {};
  document.querySelectorAll('.nav-links a').forEach(function (a) { links[a.getAttribute('href')] = a; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.id === 'contact' ? 'contacts' : e.target.id;
      Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === '#' + id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });

  var tag = document.querySelector('.tagline');
  if (tag && !reduce) {
    var roles = ['Cybersecurity Analyst', 'Ethical Hacker'];
    var r = 0, i = roles[0].length, deleting = true;
    (function tick() {
      var word = roles[r];
      i += deleting ? -1 : 1;
      tag.textContent = word.slice(0, i);
      var delay = deleting ? 35 : 75;
      if (!deleting && i === word.length) { deleting = true; delay = 1800; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
      setTimeout(tick, delay);
    })();
  }

  var c = document.getElementById('bg-canvas');
  if (!c || reduce) return;
  var ctx = c.getContext('2d');
  var pts = [], w, h, mouse = { x: -999, y: -999 };
  function resize() {
    w = c.width = window.innerWidth; h = c.height = window.innerHeight;
    var n = Math.min(70, Math.floor(w * h / 22000));
    pts = [];
    for (var k = 0; k < n; k++) pts.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.5
    });
  }
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize();
  (function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var a = 0; a < pts.length; a++) {
      var p = pts[a];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = 'rgba(61,242,255,0.65)'; ctx.fill();
      for (var b = a + 1; b < pts.length; b++) {
        var q = pts[b], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
        if (d < 14000) {
          ctx.strokeStyle = 'rgba(139,92,255,' + (1 - d / 14000) * 0.3 + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      var mx = p.x - mouse.x, my = p.y - mouse.y, md = mx * mx + my * my;
      if (md < 22000) {
        ctx.strokeStyle = 'rgba(61,242,255,' + (1 - md / 22000) * 0.5 + ')';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  })();
})();