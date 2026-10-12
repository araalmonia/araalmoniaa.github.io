document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Footer year */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Scroll progress bar + header state */
const bar = document.createElement('div');
bar.id = 'progress';
document.body.prepend(bar);
const header = document.querySelector('.site-header');

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Typing effect on the tagline */
const tagline = document.querySelector('.tagline');
if (tagline && !reduceMotion) {
  const text = tagline.textContent.trim();
  tagline.textContent = '';
  tagline.classList.add('typing');
  let i = 0;
  const type = () => {
    tagline.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(type, 70);
  };
  setTimeout(type, 600);
}

/* Reveal elements as they scroll into view */
const revealTargets = document.querySelectorAll(
  '.hero > div > *, .profile-photo, h2, .section p, .skill-list li, .card'
);
revealTargets.forEach((el, n) => {
  el.classList.add('reveal');
  if (el.matches('.skill-list li, .card')) {
    el.style.transitionDelay = ${(Array.from(el.parentElement.children).indexOf(el)) * 90}ms;
  }
});
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach((el) => revealObserver.observe(el));

/* Highlight the nav link for the section in view */
const links = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === #${entry.target.id}));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

/* Animated network background (canvas) */
(function network() {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  const mouse = { x: null, y: null };
  let w, h, dots = [], running = true;

  function resize() {
    const d = window.devicePixelRatio || 1;
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * d; canvas.height = h * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    const count = Math.min(90, Math.floor((w * h) / 16000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const p of dots) {
      if (!reduceMotion) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(61, 242, 255, 0.😎';
      ctx.fill();
    }
    for (let a = 0; a < dots.length; a++) {
      for (let b = a + 1; b < dots.length; b++) {
        const dx = dots[a].x - dots[b].x, dy = dots[a].y - dots[b].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          ctx.strokeStyle = rgba(139, 92, 255, ${0.35 * (1 - dist / 130)});
          ctx.beginPath(); ctx.moveTo(dots[a].x, dots[a].y); ctx.lineTo(dots[b].x, dots[b].y); ctx.stroke();
        }
      }
      if (mouse.x !== null) {
        const mx = dots[a].x - mouse.x, my = dots[a].y - mouse.y;
        const md = Math.hypot(mx, my);
        if (md < 170) {
          ctx.strokeStyle = rgba(61, 242, 255, ${0.5 * (1 - md / 170)});
          ctx.beginPath(); ctx.moveTo(dots[a].x, dots[a].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    }
    if (running && !reduceMotion) requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => { resize(); if (reduceMotion) frame(); });
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });

  resize();
  frame();
})();