// ============================================================
//  🎮  LEVELS — Logic for L1, L2, L3, L5, L7, L8
// ============================================================
 
// ── Shared: advance to next level ──
function advanceLevel(currentNum) {
  const current = document.getElementById('level-' + currentNum);
  const next    = document.getElementById('level-' + (currentNum + 1));
  if (!current || !next) return;
 
  // Update progress bar
  const pct = (currentNum / 8) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('level-num').textContent = currentNum + 1;
 
  // Animate current out
  current.style.animation = 'fadeDown .4s ease both';
  setTimeout(function() {
    current.style.display = 'none';
    current.style.animation = '';
    current.classList.remove('active');
 
    // Show next
    next.style.display = 'flex';
    next.style.animation = 'fadeUp .6s ease both';
    next.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
 
    // Level-specific init
    if (currentNum + 1 === 3) initLevel3();
    if (currentNum + 1 === 4) setTimeout(initLevel4, 100);
    if (currentNum + 1 === 5) initLevel5();
    if (currentNum + 1 === 6) setTimeout(initLevel6, 100);
    if (currentNum + 1 === 7) initLevel7();
    if (currentNum + 1 === 8) setTimeout(initLevel8, 100);
  }, 420);
}
 
// ── LEVEL 1 ──────────────────────────────────────────────────
function checkLevel1() {
  var input = document.getElementById('l1-input');
  var hint  = document.getElementById('l1-hint');
  var val   = input.value.toLowerCase().trim();
 
  if (val === CONFIG.level1Answer.toLowerCase().trim()) {
    hint.textContent = '\u2713 \u042f \u043f\u0430\u043c\u2019\u044f\u0442\u0430\u044e\u2026';
    hint.className = 'hint success';
    setTimeout(function() { advanceLevel(1); }, 700);
  } else {
    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake');
    hint.textContent = '\u0421\u043f\u0440\u043e\u0431\u0443\u0439 \u0437\u0433\u0430\u0434\u0430\u0442\u0438 \u0442\u043e\u0439 \u0441\u0430\u043c\u0438\u0439 \u0432\u0435\u0447\u0456\u0440\u2026';
    hint.className = 'hint error';
    setTimeout(function() { input.classList.remove('shake'); }, 500);
  }
}
 
document.addEventListener('DOMContentLoaded', function() {
  var inp = document.getElementById('l1-input');
  if (inp) inp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') checkLevel1();
  });
});
 
// ── LEVEL 2 ──────────────────────────────────────────────────
function checkLevel2() {
  var input = document.getElementById('l2-input');
  var hint  = document.getElementById('l2-hint');
  var val   = input.value.trim();
 
  if (val === CONFIG.level2Answer) {
    hint.textContent = '\u2713 \u0420\u0456\u0432\u043d\u044f\u043d\u043d\u044f \u0440\u043e\u0437\u0432\u2019\u044f\u0437\u0430\u043d\u043e. \u0426\u044f \u0434\u0430\u0442\u0430 \u2014 \u043f\u043e\u0447\u0430\u0442\u043e\u043a \u0443\u0441\u044c\u043e\u0433\u043e.';
    hint.className = 'hint success';
    setTimeout(function() { advanceLevel(2); }, 900);
  } else {
    input.classList.remove('shake');
    void input.offsetWidth;
    input.classList.add('shake');
    hint.textContent = '\u2717 \u041d\u0435\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e. \u041f\u0456\u0434\u0441\u0442\u0430\u0432 \u0434\u0430\u0442\u0443 \u0443 \u0444\u043e\u0440\u043c\u0430\u0442 DDMMYYYY\u2026';
    hint.className = 'hint error';
    setTimeout(function() { input.classList.remove('shake'); }, 500);
  }
}
 
document.addEventListener('DOMContentLoaded', function() {
  var inp = document.getElementById('l2-input');
  if (inp) inp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') checkLevel2();
  });
});
 
// ── LEVEL 3: Drag & Drop Sortable ───────────────────────────
var sortOrder = [];
var dragSrc   = null;
 
function initLevel3() {
  var container = document.getElementById('sort-cards');
  container.innerHTML = '';
  document.getElementById('l3-hint').textContent = '';
  document.getElementById('l3-confirm').style.display = 'none';
 
  // Shuffle
  sortOrder = CONFIG.level3Cards.slice();
  for (var i = sortOrder.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = sortOrder[i]; sortOrder[i] = sortOrder[j]; sortOrder[j] = tmp;
  }
 
  sortOrder.forEach(function(card) {
    var el = document.createElement('div');
    el.className = 'sort-card';
    el.draggable = true;
    el.dataset.id = card.id;
    el.innerHTML =
      '<span class="card-emoji">' + card.emoji + '</span>' +
      '<div class="card-label">' + card.label + '</div>' +
      '<div class="card-date">'  + card.date  + '</div>';
 
    el.addEventListener('dragstart', onDragStart);
    el.addEventListener('dragover',  onDragOver);
    el.addEventListener('drop',      onDrop);
    el.addEventListener('dragend',   onDragEnd);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd);
 
    container.appendChild(el);
  });
}
 
function onDragStart(e) {
  dragSrc = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function onDragOver(e) {
  e.preventDefault();
  document.querySelectorAll('.sort-card').forEach(function(c) { c.classList.remove('drag-over'); });
  this.classList.add('drag-over');
}
function onDrop(e) {
  e.preventDefault();
  if (dragSrc !== this) {
    var container = document.getElementById('sort-cards');
    var cards = Array.from(container.children);
    var srcIdx = cards.indexOf(dragSrc);
    var dstIdx = cards.indexOf(this);
    if (srcIdx < dstIdx) container.insertBefore(dragSrc, this.nextSibling);
    else container.insertBefore(dragSrc, this);
    checkSort3();
  }
}
function onDragEnd() {
  document.querySelectorAll('.sort-card').forEach(function(c) {
    c.classList.remove('dragging', 'drag-over');
  });
}
 
var touchClone = null, touchTarget = null;
function onTouchStart(e) {
  touchTarget = this;
  var touch = e.touches[0];
  touchClone = this.cloneNode(true);
  touchClone.style.cssText = 'position:fixed;pointer-events:none;opacity:.8;z-index:9999;width:' + this.offsetWidth + 'px;transform:scale(1.05) rotate(2deg);left:' + (touch.clientX - this.offsetWidth/2) + 'px;top:' + (touch.clientY - this.offsetHeight/2) + 'px;background:var(--panel);border:1px solid var(--neon);border-radius:8px;';
  document.body.appendChild(touchClone);
}
function onTouchMove(e) {
  e.preventDefault();
  var touch = e.touches[0];
  if (touchClone) {
    touchClone.style.left = (touch.clientX - touchClone.offsetWidth/2) + 'px';
    touchClone.style.top  = (touch.clientY - touchClone.offsetHeight/2) + 'px';
  }
}
function onTouchEnd(e) {
  if (touchClone) { touchClone.remove(); touchClone = null; }
  var touch = e.changedTouches[0];
  var el = document.elementFromPoint(touch.clientX, touch.clientY);
  var card = el ? el.closest('.sort-card') : null;
  if (card && card !== touchTarget) {
    var container = document.getElementById('sort-cards');
    var cards = Array.from(container.children);
    var srcIdx = cards.indexOf(touchTarget);
    var dstIdx = cards.indexOf(card);
    if (srcIdx < dstIdx) container.insertBefore(touchTarget, card.nextSibling);
    else container.insertBefore(touchTarget, card);
    checkSort3();
  }
}
 
function checkSort3() {
  var container = document.getElementById('sort-cards');
  var currentIds = Array.from(container.children).map(function(c) { return +c.dataset.id; });
  var correctIds  = CONFIG.level3Cards.map(function(c) { return c.id; });
  var correct = currentIds.every(function(id, i) { return id === correctIds[i]; });
 
  var btn = document.getElementById('l3-confirm');
  if (correct) {
    document.querySelectorAll('.sort-card').forEach(function(c) { c.classList.add('correct'); });
    btn.style.display = 'inline-block';
    document.getElementById('l3-hint').textContent = '\u2713 \u0425\u0440\u043e\u043d\u043e\u043b\u043e\u0433\u0456\u044f \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u0430!';
    document.getElementById('l3-hint').className = 'hint success';
  } else {
    document.querySelectorAll('.sort-card').forEach(function(c) { c.classList.remove('correct'); });
    btn.style.display = 'none';
    document.getElementById('l3-hint').textContent = '';
  }
}
 
function confirmLevel3() { advanceLevel(3); }
 
// ── LEVEL 5: Quiz ────────────────────────────────────────────
var quizIndex = 0;
 
function initLevel5() {
  quizIndex = 0;
  renderQuestion();
}
 
function renderQuestion() {
  var container = document.getElementById('quiz-container');
  var q = CONFIG.quizQuestions[quizIndex];
  var total = CONFIG.quizQuestions.length;
 
  container.innerHTML =
    '<div class="quiz-progress">\u041f\u0418\u0422\u0410\u041d\u041d\u042f ' + (quizIndex + 1) + ' / ' + total + '</div>' +
    '<div class="quiz-question">' + q.question + '</div>' +
    '<div class="quiz-options" id="quiz-opts">' +
    q.options.map(function(opt, i) {
      return '<button class="quiz-opt" onclick="answerQuiz(' + i + ')">' + opt + '</button>';
    }).join('') +
    '</div>' +
    '<div id="quiz-wrong-msg"></div>';
}
 
function answerQuiz(idx) {
  var q    = CONFIG.quizQuestions[quizIndex];
  var opts = document.querySelectorAll('.quiz-opt');
  opts.forEach(function(o) { o.disabled = true; });
 
  if (idx === q.correctIndex) {
    opts[idx].classList.add('correct');
    document.getElementById('quiz-wrong-msg').textContent = '\u2713 \u041f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e!';
    document.getElementById('quiz-wrong-msg').style.color = 'var(--neon)';
    setTimeout(function() {
      quizIndex++;
      if (quizIndex < CONFIG.quizQuestions.length) renderQuestion();
      else advanceLevel(5);
    }, 900);
  } else {
    opts[idx].classList.add('wrong');
    opts[q.correctIndex].classList.add('correct');
    document.getElementById('quiz-wrong-msg').textContent = q.wrongMsg;
    setTimeout(function() {
      quizIndex++;
      if (quizIndex < CONFIG.quizQuestions.length) renderQuestion();
      else advanceLevel(5);
    }, 2000);
  }
}
 
// ── LEVEL 7: Dream Tag Selection ─────────────────────────────
var selectedDreams = [];
 
function initLevel7() {
  selectedDreams = [];
  var cloud = document.getElementById('tag-cloud');
  cloud.innerHTML = '';
 
  CONFIG.dreamTags.forEach(function(tag) {
    var btn = document.createElement('button');
    btn.className = 'dream-tag';
    btn.textContent = tag;
    btn.addEventListener('click', function() { toggleDream(btn, tag); });
    cloud.appendChild(btn);
  });
 
  updateDreamUI();
}
 
function toggleDream(btn, tag) {
  var i = selectedDreams.indexOf(tag);
  if (i > -1) {
    selectedDreams.splice(i, 1);
    btn.classList.remove('selected');
  } else {
    if (selectedDreams.length >= CONFIG.dreamSelectCount) {
      var sel = document.getElementById('selected-goals');
      sel.style.color = 'var(--neon2)';
      setTimeout(function() { sel.style.color = ''; }, 500);
      return;
    }
    selectedDreams.push(tag);
    btn.classList.add('selected');
  }
  updateDreamUI();
}
 
function updateDreamUI() {
  var sel = document.getElementById('selected-goals');
  var btn = document.getElementById('l7-btn');
  var n   = selectedDreams.length;
  var max = CONFIG.dreamSelectCount;
 
  sel.textContent = '\u041e\u0431\u0440\u0430\u043d\u043e: ' + n + ' / ' + max;
 
  if (n === max) {
    btn.style.display = 'inline-block';
    sel.style.color = 'var(--neon)';
  } else {
    btn.style.display = 'none';
    sel.style.color = '';
  }
}
 
function confirmLevel7() {
  try { localStorage.setItem('questDreams', JSON.stringify(selectedDreams)); } catch(e) {}
  advanceLevel(7);
}
 
// ── LEVEL 8: Fullscreen Hearts → ∞ ───────────────────────────
var infinityDone = false;
var heartsCanvas, heartsCtx, heartsAnim;
var heartParticles = [];
 
// Called when level 8 becomes active — bind click to whole section
function initLevel8() {
  infinityDone = false;
  heartParticles = [];
 
  heartsCanvas = document.getElementById('hearts-canvas');
  heartsCtx    = heartsCanvas.getContext('2d');
  resizeHeartsCanvas();
  window.addEventListener('resize', resizeHeartsCanvas);
 
  var section = document.getElementById('level-8');
  section.addEventListener('click', onLevel8Click);
}
 
function resizeHeartsCanvas() {
  if (!heartsCanvas) return;
  heartsCanvas.width  = window.innerWidth;
  heartsCanvas.height = window.innerHeight;
}
 
function onLevel8Click() {
  if (infinityDone) return;
  infinityDone = true;
 
  // 1. Merge side 8s
  document.getElementById('eight-left').classList.add('merge');
  document.getElementById('eight-right').classList.add('merge');
 
  // 2. Fade out stage after merge
  setTimeout(function() {
    var stage = document.getElementById('infinity-stage');
    stage.style.transition = 'opacity .8s ease';
    stage.style.opacity = '0';
    stage.style.pointerEvents = 'none';
  }, 900);
 
  // 3. Launch hearts from all over screen
  setTimeout(function() {
    launchHearts();
  }, 600);
 
  // 4. Show ∞ symbol + top text + dreams
  setTimeout(function() {
    var sym = document.getElementById('inf-final-symbol');
    sym.style.display = 'block';
    requestAnimationFrame(function() {
      sym.classList.add('show');
    });
    document.getElementById('l8-top-text').classList.add('visible');
    renderSavedDreams();
    document.getElementById('saved-goals-display').classList.add('visible');
    document.getElementById('progress-bar').style.width = '100%';
    document.getElementById('level-num').textContent = '8';
  }, 2200);
}
 
// ── Heart particle system ──────────────────────────────────
var HEART_COLORS = [
  'rgba(255,94,186,',
  'rgba(0,255,200,',
  'rgba(255,100,130,',
  'rgba(255,200,220,',
  'rgba(94,143,255,'
];
 
// Lemniscate (∞) parametric points (normalized -1..1)
function infinityPoint(t) {
  // Bernoulli lemniscate: x = cos(t)/(1+sin²(t)), y = sin(t)cos(t)/(1+sin²(t))
  var s = Math.sin(t), c = Math.cos(t);
  var d = 1 + s * s;
  return { x: c / d, y: s * c / d };
}
 
function launchHearts() {
  var W = heartsCanvas.width;
  var H = heartsCanvas.height;
  var cx = W / 2, cy = H / 2;
  // infinity display size
  var rx = W * 0.30, ry = H * 0.20;
 
  heartParticles = [];
  var COUNT = 220;
 
  for (var i = 0; i < COUNT; i++) {
    // Start: random position on screen edges + interior
    var startX, startY;
    var edge = Math.floor(Math.random() * 4);
    if (edge === 0)      { startX = Math.random() * W; startY = -20; }
    else if (edge === 1) { startX = Math.random() * W; startY = H + 20; }
    else if (edge === 2) { startX = -20;               startY = Math.random() * H; }
    else                 { startX = W + 20;             startY = Math.random() * H; }
 
    // Target: point on ∞ curve
    var t = (i / COUNT) * Math.PI * 2;
    var pt = infinityPoint(t);
    var targetX = cx + pt.x * rx;
    var targetY = cy + pt.y * ry;
 
    var color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    var delay  = Math.random() * 1200; // stagger up to 1.2s
    var size   = 8 + Math.random() * 14;
 
    heartParticles.push({
      x: startX, y: startY,
      tx: targetX, ty: targetY,
      color: color,
      size: size,
      delay: delay,
      progress: 0,          // 0 → 1 flight progress
      arrived: false,
      alpha: 0,
      pulse: Math.random() * Math.PI * 2,
    });
  }
 
  var startTime = null;
  var FLIGHT_DURATION = 1600; // ms for each heart to travel
 
  function tick(now) {
    if (!startTime) startTime = now;
    var elapsed = now - startTime;
 
    heartsCtx.clearRect(0, 0, W, H);
 
    var allArrived = true;
    for (var j = 0; j < heartParticles.length; j++) {
      var p = heartParticles[j];
      var localT = elapsed - p.delay;
      if (localT < 0) { allArrived = false; continue; }
 
      var prog = Math.min(localT / FLIGHT_DURATION, 1);
      // ease out cubic
      var ease = 1 - Math.pow(1 - prog, 3);
      p.x = p.x + (p.tx - p.x) * 0.06; // smooth lerp feel
      p.y = p.y + (p.ty - p.y) * 0.06;
      p.alpha = Math.min(prog * 3, 1);
      p.pulse += 0.06;
 
      if (prog < 1) allArrived = false;
 
      // Draw heart
      heartsCtx.save();
      heartsCtx.globalAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      drawHeart(heartsCtx, p.x, p.y, p.size, p.color);
      heartsCtx.restore();
    }
 
    heartsAnim = requestAnimationFrame(tick);
  }
 
  heartsAnim = requestAnimationFrame(tick);
}
 
function drawHeart(ctx, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  // Heart path using bezier curves
  var s = size * 0.5;
  ctx.moveTo(0, s * 0.4);
  ctx.bezierCurveTo(-s, -s * 0.2, -s * 1.6, s * 0.8, 0, s * 1.6);
  ctx.bezierCurveTo(s * 1.6, s * 0.8, s, -s * 0.2, 0, s * 0.4);
  ctx.fillStyle = color + '1)';
  ctx.shadowColor = color + '0.8)';
  ctx.shadowBlur = size * 0.8;
  ctx.fill();
  ctx.restore();
}
 
function renderSavedDreams() {
  var container = document.getElementById('saved-goals-display');
  var dreams = selectedDreams.slice();
  if (!dreams.length) {
    try { dreams = JSON.parse(localStorage.getItem('questDreams') || '[]'); } catch(e) {}
  }
  container.innerHTML = dreams.map(function(d) {
    return '<span class="saved-tag">' + d + '</span>';
  }).join('');
}