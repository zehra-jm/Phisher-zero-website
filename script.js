/* ============================================================
   PHISHER ZERO — Main Script
   ============================================================ */

// ── YouTube: load iframe on click (avoids Error 153 on page load) ──
function loadVideo() {
  const thumb = document.getElementById('video-thumb');
  if (!thumb) return;
  const iframe = document.createElement('iframe');
  iframe.id = 'demo-video';
  iframe.src = 'https://www.youtube.com/embed/2whWWjuWghw?autoplay=1&rel=0';
  iframe.title = 'Phisher Zero Demo';
  iframe.frameBorder = '0';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';
  thumb.replaceWith(iframe);
}

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Particle canvas ──
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.5, 2.5),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.4, -0.1),
      alpha: rand(0.2, 0.7),
      color: Math.random() > 0.6 ? '#b8e050' : '#3cb83c',
    };
  }

  for (let i = 0; i < 120; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.001;

      if (p.y < -5 || p.alpha <= 0) particles[i] = createParticle();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Scroll reveal ──
(function initReveal() {
  const items = document.querySelectorAll(
    '.about-card, .agent-card, .doc-card, .team-card, .pipeline-box, .verdict-demo, .tech-stack, .supervisors, .hero-stats'
  );
  items.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();

// ── Smooth anchor scroll with offset for fixed navbar ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ── Agent card glow on hover ──
document.querySelectorAll('.agent-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.setProperty('--glow', '1');
  });
  card.addEventListener('mouseleave', () => {
    card.style.removeProperty('--glow');
  });
});

// ── Typing effect for hero tagline ──
(function typingEffect() {
  const el = document.querySelector('.hero-tagline');
  if (!el) return;
  const full = el.innerHTML;
  el.innerHTML = '';
  el.style.opacity = '1';
  let i = 0;
  const interval = setInterval(() => {
    el.innerHTML = full.substring(0, i);
    i++;
    if (i > full.length) clearInterval(interval);
  }, 18);
})();

// ── Counter animation for hero stats ──
(function animateCounters() {
  const counters = [
    { el: null, target: 800, suffix: 'ms', prefix: '<' },
    { el: null, target: 70,  suffix: '+',  prefix: '' },
    { el: null, target: 4,   suffix: '',   prefix: '' },
  ];

  const vals = document.querySelectorAll('.stat-val');
  if (vals.length < 3) return;

  counters.forEach((c, idx) => { c.el = vals[idx]; });

  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();

    counters.forEach(c => {
      let start = 0;
      const duration = 1400;
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(eased * c.target);
        c.el.textContent = c.prefix + value + c.suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
})();
