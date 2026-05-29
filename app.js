// ============================================================
//  🚀  APP — Main orchestration
// ============================================================
 
document.addEventListener('DOMContentLoaded', function() {
  // Hide all levels except level 1
  for (var i = 2; i <= 8; i++) {
    var lvl = document.getElementById('level-' + i);
    if (lvl) lvl.style.display = 'none';
  }
  // Make sure level 1 is visible
  var l1 = document.getElementById('level-1');
  if (l1) {
    l1.style.display = 'flex';
    l1.classList.add('active');
  }
});
 
// Ctrl+Shift+Y — skip current level
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'Y') {
    var active = document.querySelector('.level.active');
    if (active) {
      var num = parseInt(active.id.replace('level-', ''));
      if (num < 8) advanceLevel(num);
    }
  }
});