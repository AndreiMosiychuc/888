// ============================================================
//  🖌️  SCRATCH — Level 6 (Canvas scratch-off effect)
// ============================================================

function initLevel6() {
  const photo  = document.getElementById('scratch-photo');
  const canvas = document.getElementById('scratch-canvas');
  const wrap   = document.getElementById('scratch-wrap');
  const hint   = document.getElementById('l6-hint');

  // Load photo (fallback to placeholder if custom not available)
  photo.onerror = () => { photo.src = CONFIG.scratchPhotoFallback; };
  photo.src = CONFIG.scratchPhoto;

  photo.onload = () => {
    setupScratchCanvas(canvas, wrap, hint);
  };

  // If already loaded (cached)
  if (photo.complete && photo.naturalWidth > 0) {
    setupScratchCanvas(canvas, wrap, hint);
  }
}

function setupScratchCanvas(canvas, wrap, hint) {
  const photo = document.getElementById('scratch-photo');
  const W = photo.offsetWidth  || 500;
  const H = photo.offsetHeight || 400;

  canvas.width  = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');

  // Fill with cyberpunk "noise" cover
  drawCover(ctx, W, H);

  let isDrawing = false;
  let revealed  = false;
  let totalPixels = W * H;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function scratch(e) {
    const { x, y } = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    if (!revealed) checkReveal(ctx, W, H);
  }

  function checkReveal(ctx, W, H) {
    const data = ctx.getImageData(0, 0, W, H).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparent++;
    }
    const pct = transparent / (W * H);
    if (pct > 0.85) {
      revealed = true;
      // Clear entirely
      ctx.clearRect(0, 0, W, H);
      wrap.classList.add('revealed');
      hint.textContent = '✓ Спогад проявлено…';
      hint.className = 'hint success';
      setTimeout(() => advanceLevel(6), 1400);
    }
  }

  // Mouse events
  canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
  canvas.addEventListener('mousemove', (e) => { if (isDrawing) scratch(e); });
  canvas.addEventListener('mouseup',   () => { isDrawing = false; });
  canvas.addEventListener('mouseleave',() => { isDrawing = false; });

  // Touch events
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; scratch(e); }, { passive: false });
  canvas.addEventListener('touchmove',  (e) => { e.preventDefault(); if (isDrawing) scratch(e); }, { passive: false });
  canvas.addEventListener('touchend',   () => { isDrawing = false; });
}

function drawCover(ctx, W, H) {
  // Dark gradient base
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0,   '#04060f');
  grad.addColorStop(.5,  '#080d1c');
  grad.addColorStop(1,   '#04060f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Random noise dots
  ctx.save();
  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    const alpha = Math.random() * .35;
    ctx.fillStyle = `rgba(0,255,200,${alpha})`;
    ctx.fill();
  }

  // Grid lines
  ctx.strokeStyle = 'rgba(0,255,200,0.06)';
  ctx.lineWidth = 1;
  for (let y = 0; y < H; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  for (let x = 0; x < W; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }

  // Center text hint
  ctx.globalCompositeOperation = 'source-over';
  ctx.font = 'bold 18px "Share Tech Mono"';
  ctx.fillStyle = 'rgba(0,255,200,0.4)';
  ctx.textAlign = 'center';
  ctx.fillText('[ СТИРАЙ ЩОБ ПРОЯВИТИ ]', W / 2, H / 2);
  ctx.restore();
}
