// ============================================================
//  🌌  BACKGROUND — Cyberpunk Particle Grid
// ============================================================

(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], lines = [];
  const PARTICLE_COUNT = 55;
  const NEON  = 'rgba(0,255,200,';
  const PINK  = 'rgba(255,94,186,';
  const BLUE  = 'rgba(94,143,255,';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    const colors = [NEON, PINK, BLUE];
    const c = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: rand(0, W), y: rand(0, H),
      vx: rand(-.25, .25), vy: rand(-.25, .25),
      r: rand(.5, 2),
      color: c,
      alpha: rand(.2, .7),
    };
  }

  function init() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function drawGrid() {
    // Subtle horizontal scan lines
    ctx.save();
    ctx.strokeStyle = 'rgba(0,255,200,0.025)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let y = 0; y < H; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 130) * 0.1;
          ctx.strokeStyle = `rgba(0,255,200,${alpha})`;
          ctx.lineWidth = .5;
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  loop();
})();
