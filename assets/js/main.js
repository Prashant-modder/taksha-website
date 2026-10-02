// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Nav scroll state ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ---------- Mobile menu ----------
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle) toggle.addEventListener('click', () => links.classList.toggle('open'));

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

// ---------- Tease card scramble ----------
const scrambleEl = document.getElementById('teaseScramble');
if (scrambleEl) {
  const target = 'MERITBITS';
  const chars = '#@$%&*!?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let frame = 0;
  const totalFrames = 90;
  const startDelay = 600;

  setTimeout(() => {
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * target.length);

      let out = '';
      for (let i = 0; i < target.length; i++) {
        if (i < revealed) out += target[i];
        else out += chars[Math.floor(Math.random() * chars.length)];
      }
      scrambleEl.textContent = out;

      if (frame >= totalFrames) {
        clearInterval(interval);
        scrambleEl.textContent = target;
        scrambleEl.style.color = '#00ffd5';
        scrambleEl.style.textShadow = '0 0 20px #00ffd5';
      }
    }, 40);
  }, startDelay);
}

// ---------- Tease progress bar ----------
const progress = document.getElementById('teaseProgress');
if (progress) {
  const target = 40 + Math.random() * 25; // 40–65% “in development”
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        progress.style.width = target + '%';
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  io.observe(progress);
}

// ---------- Scroll reveal ----------
const revealTargets = document.querySelectorAll('.principle, .section-title, .cta-inner, .tease-inner');
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

// ---------- Subtle parallax on cubes ----------
if (window.matchMedia('(pointer: fine)').matches) {
  const cubes = document.querySelectorAll('.cube');
  window.addEventListener('mousemove', (e) => {
    const cx = (e.clientX / window.innerWidth - 0.5) * 2;
    const cy = (e.clientY / window.innerHeight -
