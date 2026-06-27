'use strict';

const API_BASE = 'http://localhost:3000';

const CAT_CLASS = {
  frontend: 'cat-frontend', backend: 'cat-backend',
  'data-science': 'cat-data-science', design: 'cat-design',
  security: 'cat-security', devops: 'cat-devops',
};
const EMOJI_MAP = {
  frontend: '⚛️', backend: '🌐', 'data-science': '📊',
  design: '🧠', security: '🛡️', devops: '☁️',
};
const GRAD_MAP = {
  frontend: 'linear-gradient(135deg,#1e1b4b,#312e81)',
  backend: 'linear-gradient(135deg,#0c1a2e,#1e3a5f)',
  'data-science': 'linear-gradient(135deg,#78350f,#b45309)',
  design: 'linear-gradient(135deg,#1f2937,#374151)',
  security: 'linear-gradient(135deg,#0f0f1a,#1a0533)',
  devops: 'linear-gradient(135deg,#1e3a5f,#0ea5e9)',
};

let COURSES = [];
let state = { filter: 'inprogress', category: null, difficulty: null, sort: 'recent', search: '' };

const coursesGrid  = document.getElementById('coursesGrid');
const sortSelect   = document.getElementById('sortSelect');
const searchInput  = document.getElementById('searchInput');
const searchDrop   = document.getElementById('searchDropdown');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');
const toast        = document.getElementById('toast');
const continueBtn  = document.getElementById('continueBtn');
const notifBtn     = document.getElementById('notifBtn');

// ── STEP A: Central API function — yeh saari fetch() calls handle karta hai
async function apiCall(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'TypeError') throw new Error('Server band hai ya CORS block kar raha hai');
    throw err;
  }
}

// ── STEP B: Backend se courses load karo
async function loadCourses() {
  coursesGrid.innerHTML = `<div class="empty-state"><div class="empty-icon">⏳</div><p>Courses load ho rahe hain...</p></div>`;
  try {
    COURSES = await apiCall('/api/courses');
    renderCourses();
    showToast('✅ Courses load ho gaye!');
  } catch (err) {
    coursesGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p style="color:#ef4444;font-weight:600;">Error: ${err.message}</p>
        <button onclick="loadCourses()" style="margin-top:14px;padding:9px 20px;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:.9rem;">🔄 Retry</button>
      </div>`;
  }
}

// ── STEP C: Backend se stats load karo aur UI update karo
async function loadStats() {
  try {
    const s = await apiCall('/api/stats');
    const vals = document.querySelectorAll('.stat-value');
    if (vals[0]) vals[0].textContent = s.hoursLearned;
    if (vals[1]) vals[1].textContent = s.certificates;
    if (vals[2]) vals[2].textContent = `${s.currentStreak} Days`;
    if (vals[3]) vals[3].textContent = s.skillScore;
    const badge = document.querySelector('.achievement-badge');
    if (badge) badge.textContent = `⚡ YOUR DAILY ACHIEVEMENT: ${s.dailyMinutes} MIN`;
  } catch (err) {
    console.warn('Stats load nahi hue:', err.message);
  }
}

// ── Filter + Sort logic
function getFiltered() {
  let list = [...COURSES];
  if (state.filter === 'inprogress') list = list.filter(c => !c.completed && c.progress > 0 && c.progress < 100);
  else if (state.filter === 'completed') list = list.filter(c => c.completed || c.progress === 100);
  else if (state.filter === 'daily') list = list.filter(c => c.progress < 30 && c.progress > 0);
  if (state.category) list = list.filter(c => c.category === state.category);
  if (state.difficulty) list = list.filter(c => c.difficulty === state.difficulty);
  if (state.search.trim()) {
    const q = state.search.toLowerCase();
    list = list.filter(c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || (c.instructor || '').toLowerCase().includes(q));
  }
  if (state.sort === 'progress') list.sort((a, b) => b.progress - a.progress);
  else if (state.sort === 'name') list.sort((a, b) => a.title.localeCompare(b.title));
  return list;
}

// ── Card HTML banao
function renderCard(c) {
  const isDone = c.completed || c.progress === 100;
  const catLabel = c.category.toUpperCase().replace('-', ' ');
  const footer = isDone
    ? `<button class="btn-cert" data-id="${c.id}">🏅 View Certificate</button>`
    : `<button class="btn-resume" data-id="${c.id}">▶ Resume</button>`;
  return `
    <article class="course-card" data-id="${c.id}" tabindex="0" role="button" aria-label="${c.title}">
      ${isDone ? '<span class="completed-badge">✓ Completed</span>' : ''}
      <div class="card-thumb-placeholder" style="background:${GRAD_MAP[c.category] || '#1e1b4b'}">${EMOJI_MAP[c.category] || '📚'}</div>
      <div class="card-body">
        <p class="card-category ${CAT_CLASS[c.category] || ''}">${catLabel}</p>
        <h3 class="card-title">${c.title}</h3>
        <div class="progress-row"><span>Progress</span><span>${c.progress}%</span></div>
        <div class="progress-bar-wrap">
          <div class="${isDone ? 'progress-bar-fill done' : 'progress-bar-fill'}" style="width:${c.progress}%"></div>
        </div>
      </div>
      <div class="card-footer">${footer}</div>
    </article>`;
}

// ── Courses grid render karo
function renderCourses() {
  const list = getFiltered();
  if (!list.length) {
    coursesGrid.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p>Koi course nahi mila. Filters change karo.</p></div>`;
    return;
  }
  coursesGrid.innerHTML = list.map(renderCard).join('');
  coursesGrid.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', e => { if (!e.target.closest('button')) openModal(+card.dataset.id); });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(+card.dataset.id); });
  });
  coursesGrid.querySelectorAll('.btn-resume').forEach(btn => {
    btn.addEventListener('click', () => { const c = COURSES.find(c => c.id === +btn.dataset.id); showToast(`▶ Resuming "${c.title}"…`); });
  });
  coursesGrid.querySelectorAll('.btn-cert').forEach(btn => {
    btn.addEventListener('click', () => { const c = COURSES.find(c => c.id === +btn.dataset.id); showToast(`🏅 Certificate: "${c.title}"`); });
  });
}

// ── STEP D: Modal — backend se live data fetch karo
async function openModal(id) {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalContent.innerHTML = '<p style="text-align:center;padding:40px;color:#64748b">⏳ Loading...</p>';
  try {
    const c = await apiCall(`/api/courses/${id}`);
    const isDone = c.completed || c.progress === 100;
    const catLabel = c.category.toUpperCase().replace('-', ' ');
    const remaining = isDone ? 0 : Math.round(c.lessons * (1 - c.progress / 100));
    modalContent.innerHTML = `
      <p class="modal-cat ${CAT_CLASS[c.category] || ''}">${catLabel}</p>
      <h2 class="modal-title">${c.title}</h2>
      <p class="modal-progress-label">Progress — ${c.progress}%</p>
      <div class="modal-bar-wrap"><div class="modal-bar-fill" style="width:${c.progress}%"></div></div>
      <div class="modal-stats">
        <div class="modal-stat"><div class="modal-stat-val">${c.lessons}</div><div class="modal-stat-lbl">LESSONS</div></div>
        <div class="modal-stat"><div class="modal-stat-val">${remaining}</div><div class="modal-stat-lbl">REMAINING</div></div>
        <div class="modal-stat"><div class="modal-stat-val">${c.duration}</div><div class="modal-stat-lbl">DURATION</div></div>
      </div>
      <p style="font-size:.83rem;color:var(--clr-muted);margin-bottom:16px;">
        👤 Instructor: <strong>${c.instructor}</strong> &nbsp;|&nbsp;
        🎯 Difficulty: <strong style="text-transform:capitalize">${c.difficulty}</strong>
      </p>
      <button class="modal-btn" id="modalActionBtn">${isDone ? '🏅 View Certificate' : '▶ Continue Learning'}</button>`;
    document.getElementById('modalActionBtn').addEventListener('click', () => {
      closeModal();
      showToast(isDone ? `🏅 Certificate: "${c.title}"` : `▶ Resuming "${c.title}"…`);
    });
  } catch (err) {
    modalContent.innerHTML = `<p style="color:#ef4444;text-align:center;padding:20px;">⚠️ Load nahi hua: ${err.message}</p>`;
  }
}

function closeModal() { modalOverlay.classList.remove('open'); document.body.style.overflow = ''; }
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Toast
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Sidebar Filters
document.querySelectorAll('.filter-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.filter-item').forEach(el => el.classList.remove('active'));
    item.classList.add('active');
    state.filter = item.dataset.filter;
    state.category = null; state.difficulty = null;
    document.querySelectorAll('.cat-item, .pill').forEach(el => el.classList.remove('active'));
    renderCourses();
  });
});
document.querySelectorAll('.cat-item').forEach(item => {
  item.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('active'));
    if (isActive) { state.category = null; }
    else { item.classList.add('active'); state.category = item.dataset.cat; state.filter = 'all'; document.querySelectorAll('.filter-item').forEach(el => el.classList.remove('active')); document.querySelector('[data-filter="all"]').classList.add('active'); }
    renderCourses();
  });
});
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const isActive = pill.classList.contains('active');
    document.querySelectorAll('.pill').forEach(el => el.classList.remove('active'));
    if (isActive) state.difficulty = null;
    else { pill.classList.add('active'); state.difficulty = pill.dataset.diff; }
    renderCourses();
  });
});
document.querySelectorAll('.section-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const target = document.getElementById(toggle.dataset.target);
    const isOpen = !target.classList.contains('closed');
    target.classList.toggle('closed', isOpen);
    toggle.classList.toggle('collapsed', isOpen);
  });
});

sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; renderCourses(); });

searchInput.addEventListener('input', () => { state.search = searchInput.value; updateSearchDropdown(); renderCourses(); });
searchInput.addEventListener('focus', updateSearchDropdown);
document.addEventListener('click', e => { if (!e.target.closest('.nav-search')) searchDrop.classList.remove('open'); });

function updateSearchDropdown() {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchDrop.classList.remove('open'); return; }
  const matches = COURSES.filter(c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)).slice(0, 5);
  searchDrop.innerHTML = matches.length
    ? matches.map(c => `<div class="search-result-item" data-id="${c.id}">${c.title.replace(new RegExp(`(${q})`, 'gi'), '<strong>$1</strong>')} <span style="font-size:.7rem;color:var(--clr-light);margin-left:6px;">${c.category.toUpperCase()}</span></div>`).join('')
    : `<div class="search-result-item" style="color:var(--clr-muted)">Koi result nahi</div>`;
  searchDrop.classList.add('open');
  searchDrop.querySelectorAll('.search-result-item[data-id]').forEach(item => {
    item.addEventListener('click', () => { openModal(+item.dataset.id); searchDrop.classList.remove('open'); searchInput.value = ''; state.search = ''; renderCourses(); });
  });
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => { e.preventDefault(); document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active')); link.classList.add('active'); showToast(`Navigating to ${link.textContent}…`); });
});
notifBtn.addEventListener('click', () => showToast('🔔 3 new notifications — check Settings'));
continueBtn.addEventListener('click', () => openModal(1));
document.querySelector('.upgrade-btn').addEventListener('click', () => showToast('🚀 Upgrade page coming soon!'));

// ── STEP E: App start — dono APIs ek saath call karo
(async () => {
  await Promise.all([loadCourses(), loadStats()]);
})();