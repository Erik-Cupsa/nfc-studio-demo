'use strict';
const scenes = [
  { id: 'golden', name: 'Golden hour', color: '#ffbd78', description: 'Warm amber' },
  { id: 'ocean', name: 'Ocean blue', color: '#67c9ff', description: 'Cool blue' },
  { id: 'rose', name: 'After hours', color: '#f38bcd', description: 'Soft pink' }
];
const storageKey = 'studio-tap-scene-v1';
let index = 0;
let pending;
let countdown;
try { const stored = localStorage.getItem(storageKey); const found = scenes.findIndex(s => s.id === stored); if (found >= 0) index = found; } catch { /* Preview still works without persistent storage. */ }
const $ = id => document.getElementById(id);
function render(message) {
  const scene = scenes[index];
  document.documentElement.style.setProperty('--scene', scene.color);
  $('scene-name').textContent = scene.name;
  $('room-caption').textContent = scene.description;
  $('room').setAttribute('aria-label', `Illustrated recording office with ${scene.description.toLowerCase()} lighting`);
  $('scene-count').textContent = `${index + 1} / ${scenes.length}`;
  document.querySelectorAll('[data-scene]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.scene === scene.id)));
  if (message) $('status').textContent = message;
  try { localStorage.setItem(storageKey, scene.id); } catch { /* No dependency on storage for manual rehearsal. */ }
}
function select(next, message) { clearTimeout(pending); clearInterval(countdown); index = next; render(message); }
$('next').addEventListener('click', () => select((index + 1) % scenes.length, 'Preview changed. Ready for another take.'));
$('reset').addEventListener('click', () => select(0, 'Reset to Golden hour. Ready for your next tap.'));
document.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => select(scenes.findIndex(s => s.id === button.dataset.scene), 'Scene selected.')));
$('setup-button').addEventListener('click', () => { const open = $('setup').hidden; $('setup').hidden = !open; $('setup-button').setAttribute('aria-expanded', String(open)); if (open) $('setup').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'}); });
const shortcutURL = new URL(location.pathname, location.origin);
shortcutURL.search = '?action=rehearse&take=NUMBER';
$('shortcut-url').value = shortcutURL.href;
$('copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(shortcutURL.href); $('copy').textContent = 'Copied'; }
  catch { $('shortcut-url').focus(); $('shortcut-url').select(); $('copy').textContent = 'Select & copy'; }
});
// A URL action is consumed once. Refresh and browser history do not replay it.
// "take" makes each Shortcuts invocation a fresh Safari navigation; it proves no NFC scan.
const params = new URLSearchParams(location.search);
const requested = scenes.findIndex(s => s.id === params.get('scene'));
const advance = params.get('action') === 'next';
const rehearse = params.get('action') === 'rehearse';
if (rehearse) index = 0;
render();
if (rehearse || advance || requested >= 0) {
  history.replaceState(null, '', location.pathname);
  $('status').textContent = 'Opening your scene…';
  pending = setTimeout(() => select(rehearse ? 1 : advance ? (index + 1) % scenes.length : requested, 'Preview changed from a link.'), 700);
}

// Explicit, cancellable rehearsal for filming without a physical NFC trigger.
$('rehearse').addEventListener('click', () => {
  select(0, 'Simulated tap in 3…');
  let seconds = 3;
  countdown = setInterval(() => {
    seconds -= 1;
    if (seconds === 0) select(1, 'Timed rehearsal complete. No NFC scan was used.');
    else $('status').textContent = `Simulated tap in ${seconds}…`;
  }, 1000);
});
if (params.get('setup') === '1') {
  $('setup').hidden = false;
  $('setup-button').setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => $('setup').scrollIntoView({block:'start'}));
}
