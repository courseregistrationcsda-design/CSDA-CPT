/* CSDA modal focus trapping and global keyboard accessibility. */
function activeModalPanel(){
  return document.querySelector('.modal.on[role="dialog"]') ||
    document.querySelector('.pc.flipped:not(.closing) .pcback[role="dialog"]');
}
function trapModalFocus(e){
  if (e.key !== 'Tab') return false;
  var panel = activeModalPanel();
  if (!panel) return false;
  var list = Array.prototype.slice.call(panel.querySelectorAll(
    'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),' +
    'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
  )).filter(function(el){ return el.offsetParent !== null; });
  if (!list.length) { e.preventDefault(); panel.focus(); return true; }
  var first = list[0], last = list[list.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); return true; }
  if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); return true; }
  if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); return true; }
  return false;
}

document.addEventListener('keydown', function(e){
  if (trapModalFocus(e)) return;
  if (e.key === 'Escape') {
    if (!anyOpen() && feed.querySelector('.pc.flipped')) { unflipAll(null); return; }
    if (GUARDED_PANELS[openKind]) { nudgeUseX(openKind); return; }
    if (anyOpen()) { closeAll(); return; }
    if (query) { qEl.value = ''; onSearch(); }
    qEl.blur(); return;
  }
  if (anyOpen()) return;
  var tag = (document.activeElement.tagName || '').toLowerCase();
  if (e.key === '/' && tag !== 'input' && tag !== 'textarea') { e.preventDefault(); qEl.focus(); qEl.select(); }
});


