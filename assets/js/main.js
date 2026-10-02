// ---------- Year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Nav scroll state ----------
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// ---------- Mobile menu ----------
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) toggle.addEventListener('click', () => links.classList.toggle('open'));

// ---------- Cursor glow ----------
const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  let x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  (function loop() {
    x += (tx - x) * 0.15;
    y += (ty - y) * 0.15;
    glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
}

// ---------- Scramble helper ----------
function scramble(el, target, opts = {}) {
  if (!el) return;
  const chars = '#@$%&*!?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const totalFrames = opts.frames || 90;
  const startDelay = opts.delay || 600;
  const frameMs = opts.frameMs || 40;

  setTimeout(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * target.length);

      let out = '';
      for (let i = 0; i < target.length; i++) {
        if (i < revealed) out += target[i];
        else out += chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = out;

      if (frame >= totalFrames) {
        clearInterval(interval);
        el.textContent = target;
        el.style.color = '#00ffd5';
        el.style.textShadow = '0 0 20px #00ffd5';
      }
    }, frameMs);
  }, startDelay);
}

// Index page scramble
scramble(document.getElementById('teaseScramble'), 'MERITBITS');

// Products page scramble
scramble(document.getElementById('mbScramble'), 'MERITBITS', { frames: 70, delay: 400 });

// ---------- Progress bars (auto on reveal) ----------
function animateProgress(el, target) {
  if (!el) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        el.style.width = target + '%';
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  io.observe(el);
}

animateProgress(document.getElementById('teaseProgress'), 40 + Math.random() * 25);
animateProgress(document.getElementById('mbProgress'), 40 + Math.random() * 25);

// ---------- Scroll reveal ----------
const revealTargets = document.querySelectorAll(
  '.principle, .section-title, .cta-inner, .tease-inner, .about-block, .contact-card, .contact-note, .product-card, .products-coming'
);
revealTargets.forEach((el) => el.classList.add('reveal'));
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach((el) => revealIO.observe(el));

// ---------- Parallax cubes ----------
if (window.matchMedia('(pointer: fine)').matches) {
  const cubes = document.querySelectorAll('.cube');
  if (cubes.length) {
    window.addEventListener('mousemove', (e) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      cubes.forEach((c, i) => {
        const depth = (i + 1) * 4;
        c.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
      });
    });
  }
}
