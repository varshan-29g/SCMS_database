/* ============================================================
   SCMS — GLOBAL UTILITIES (main.js)
   Auth guard, theme toggle, custom cursor, loading, toasts
   ============================================================ */

const API_BASE = 'http://localhost:5000/api';

/* ─── Auth ─────────────────────────────────────────────────── */
const Auth = {
  getToken: () => localStorage.getItem('scms_token'),
  getUser:  () => { try { return JSON.parse(localStorage.getItem('scms_user')); } catch { return null; } },
  getRole:  () => localStorage.getItem('scms_role'),
  setSession(token, user, role) {
    localStorage.setItem('scms_token', token);
    localStorage.setItem('scms_user',  JSON.stringify(user));
    localStorage.setItem('scms_role',  role);
  },
  clear() {
    localStorage.removeItem('scms_token');
    localStorage.removeItem('scms_user');
    localStorage.removeItem('scms_role');
  },
  isLoggedIn: () => !!localStorage.getItem('scms_token'),
  requireAuth(allowedRoles = []) {
    if (!this.isLoggedIn()) { window.location.href = '/frontend/login.html'; return false; }
    if (allowedRoles.length && !allowedRoles.includes(this.getRole())) {
      window.location.href = '/frontend/login.html'; return false;
    }
    return true;
  }
};

/* ─── API Fetch Wrapper ─────────────────────────────────────── */
const API = {
  async request(method, endpoint, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = Auth.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { method, headers };
    if (body && method !== 'GET') opts.body = JSON.stringify(body);
    const res = await fetch(`${API_BASE}${endpoint}`, opts);
    const data = await res.json();
    if (res.status === 401 || res.status === 403) {
      Auth.clear();
      window.location.href = '/frontend/login.html';
      return;
    }
    return data;
  },
  get:    (ep)           => API.request('GET',    ep),
  post:   (ep, body)     => API.request('POST',   ep, body),
  put:    (ep, body)     => API.request('PUT',    ep, body),
  delete: (ep)           => API.request('DELETE', ep),
  async upload(endpoint, formData) {
    const headers = {};
    const token = Auth.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', headers, body: formData });
    return res.json();
  }
};

/* ─── Toast Notifications ───────────────────────────────────── */
function showToast(title, msg = '', type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ''}
    </div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ─── Loading Screen ────────────────────────────────────────── */
function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  setTimeout(() => screen.classList.add('hidden'), 1800);
}


/* ─── Dark / Light Theme ────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem('scms_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('scms_theme', next);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}

/* ─── Sidebar ───────────────────────────────────────────────── */
function initSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const toggle   = document.getElementById('sidebar-toggle');
  const overlay  = document.getElementById('sidebar-overlay');
  if (!sidebar) return;

  // Populate user info
  const user = Auth.getUser();
  if (user) {
    const nameEl   = document.getElementById('sidebar-user-name');
    const roleEl   = document.getElementById('sidebar-user-role');
    const avatarEl = document.getElementById('sidebar-avatar');
    if (nameEl)   nameEl.textContent   = user.name || 'User';
    if (roleEl)   roleEl.textContent   = Auth.getRole() || '';
    if (avatarEl) {
      if (user.avatar) { const img = document.createElement('img'); img.src = user.avatar; avatarEl.appendChild(img); }
      else avatarEl.textContent = (user.name || 'U')[0].toUpperCase();
    }
  }

  // Toggle
  toggle && toggle.addEventListener('click', () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      sidebar.classList.toggle('mobile-open');
      overlay && overlay.classList.toggle('visible');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  });

  overlay && overlay.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('visible');
  });

  // Active nav item
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('href') === currentPage || item.dataset.page === currentPage) {
      item.classList.add('active');
    }
  });

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn && logoutBtn.addEventListener('click', () => {
    Auth.clear();
    window.location.href = '/frontend/login.html';
  });
}

/* ─── Modal Helper ──────────────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}
function initModals() {
  document.querySelectorAll('[data-modal-open]').forEach(btn =>
    btn.addEventListener('click', () => openModal(btn.dataset.modalOpen)));
  document.querySelectorAll('[data-modal-close]').forEach(btn =>
    btn.addEventListener('click', () => closeModal(btn.dataset.modalClose)));
  document.querySelectorAll('.modal-backdrop').forEach(backdrop =>
    backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.classList.remove('open'); }));
}

/* ─── Chatbot ───────────────────────────────────────────────── */
const CHATBOT_RESPONSES = {
  attendance: 'Your attendance is tracked per subject. You need 75% to be eligible for exams.',
  fee:        'Fee payment can be done online via the Fee Management page. Contact admin for waivers.',
  exam:       'Exam schedules are published on the Examination page. Hall tickets are generated automatically.',
  library:    'Library books can be issued for 14 days. Fine is ₹2 per day after due date.',
  hostel:     'Hostel room allocation is managed by the admin. Visit the Hostel page to check your room.',
  timetable:  'Your timetable is available on the Timetable page, filtered by your department and semester.',
  default:    'I\'m the SCMS AI Assistant. I can help with attendance, fees, exams, library, hostel, and timetable queries.'
};

function initChatbot() {
  const btn   = document.getElementById('chatbot-btn');
  const panel = document.getElementById('chatbot-panel');
  const msgs  = document.getElementById('chatbot-messages');
  const input = document.getElementById('chatbot-input');
  const send  = document.getElementById('chatbot-send');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => panel.classList.toggle('open'));

  function addMsg(text, from) {
    const div = document.createElement('div');
    div.className = `chat-msg ${from}`;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  addMsg('👋 Hi! I\'m your SCMS Assistant. Ask me about attendance, fees, exams, library, or hostel!', 'bot');

  function handleSend() {
    const text = (input.value || '').trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = CHATBOT_RESPONSES.default;
      for (const [key, val] of Object.entries(CHATBOT_RESPONSES)) {
        if (lower.includes(key)) { reply = val; break; }
      }
      addMsg(reply, 'bot');
    }, 600);
  }

  send.addEventListener('click', handleSend);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
}

/* ─── Animate counter numbers ───────────────────────────────── */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const step = target / 60;
  const update = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString() + suffix;
    if (start < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ─── Table search & sort ───────────────────────────────────── */
function initTableSearch(inputId, tableBodyId) {
  const input = document.getElementById(inputId);
  const tbody = document.getElementById(tableBodyId);
  if (!input || !tbody) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    Array.from(tbody.rows).forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

/* ─── Format helpers ────────────────────────────────────────── */
const fmt = {
  date: d => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—',
  currency: n => '₹' + parseFloat(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 }),
  pct: n => parseFloat(n || 0).toFixed(1) + '%',
  initials: name => (name || '?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(),
};

/* ─── Global init ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLoadingScreen();
  initCursor();
  initSidebar();
  initModals();
  initChatbot();

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // Theme icon init
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (themeToggle) themeToggle.textContent = isDark ? '☀️' : '🌙';
});
