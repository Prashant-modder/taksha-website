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
// Auto-add .reveal to common selectors
const autoRevealSelectors = [
  '.principle', '.section-title', '.cta-inner', '.tease-inner',
  '.about-block', '.contact-card', '.contact-note', '.product-card', '.products-coming'
];
document.querySelectorAll(autoRevealSelectors.join(',')).forEach((el) => el.classList.add('reveal'));

// Observe EVERYTHING with .reveal in the HTML (this includes .mb-block, .mb-feature, .phone, .mb-role, etc.)
const revealTargets = document.querySelectorAll('.reveal');
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
revealTargets.forEach((el) => revealIO.observe(el));

// Safety net: force-reveal anything still hidden after 1.5s
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
    el.classList.add('visible');
  });
}, 1500);

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

// ---------- Constellation background ----------
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'constellation';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width, height, dots = [];
  const mouse = { x: null, y: null, radius: 160 };

  const COLORS = {
    dot: 'rgba(0, 194, 255, 0.55)',
    dotNear: 'rgba(0, 255, 213, 0.9)',
    lineDot: 'rgba(0, 194, 255, 0.18)',
    lineMouse: 'rgba(0, 255, 213, 0.45)'
  };

  function resize() {
    width = canvas.width = window.innerWidth * devicePixelRatio;
    height = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);
    width = window.innerWidth;
    height = window.innerHeight;

    // Density scales with screen size, capped so phones don't melt
    const density = Math.min(Math.floor((width * height) / 14000), 110);
    dots = [];
    for (let i = 0; i < density; i++) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // Update + draw dots
    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > width) d.vx *= -1;
      if (d.y < 0 || d.y > height) d.vy *= -1;

      // Are we near the mouse?
      let nearMouse = false;
      if (mouse.x !== null) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        nearMouse = dx * dx + dy * dy < mouse.radius * mouse.radius;
      }

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = nearMouse ? COLORS.dotNear : COLORS.dot;
      ctx.fill();
    }

    // Connect dots to nearby dots
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = COLORS.lineDot;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Connect dots to mouse
    if (mouse.x !== null) {
      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = 1 - dist / mouse.radius;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 255, 213, ${alpha * 0.45})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  // Track mouse
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Touch support (mobile — finger acts like mouse)
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mouse.x = t.clientX;
    mouse.y = t.clientY;
  }, { passive: true });
  window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', resize);
  resize();
  step();
})();
