/* ============================================================
   SCMS — SIDEBAR BUILDER (sidebar.js)
   Dynamically injects role-aware sidebar HTML
   ============================================================ */

const SIDEBAR_NAV = {
  Admin: [
    { section: 'Overview' },
    { label: 'Dashboard',     href: 'admin-dashboard.html',  icon: '⊞' },
    { label: 'Analytics',     href: 'analytics.html',        icon: '📊' },
    { section: 'Management' },
    { label: 'Students',      href: 'admin-dashboard.html#students', icon: '🎓' },
    { label: 'Faculty',       href: 'admin-dashboard.html#faculty',  icon: '👨‍🏫' },
    { label: 'Departments',   href: 'admin-dashboard.html#depts',    icon: '🏛' },
    { label: 'Courses',       href: 'admin-dashboard.html#courses',  icon: '📖' },
    { section: 'Modules' },
    { label: 'Attendance',    href: 'attendance.html',       icon: '✅' },
    { label: 'Examination',   href: 'admin-dashboard.html#exams',    icon: '📝' },
    { label: 'Fee Management',href: 'fee-management.html',   icon: '💰' },
    { label: 'Library',       href: 'library.html',          icon: '📚' },
    { label: 'Hostel',        href: 'hostel.html',           icon: '🏠' },
    { label: 'Timetable',     href: 'timetable.html',        icon: '📅' },
    { label: 'Notifications', href: 'notifications.html',    icon: '🔔', badge: '0' },
    { section: 'Account' },
    { label: 'Profile',       href: 'profile.html',          icon: '👤' },
  ],
  Student: [
    { section: 'Overview' },
    { label: 'Dashboard',     href: 'student-dashboard.html', icon: '⊞' },
    { section: 'Academics' },
    { label: 'Attendance',    href: 'attendance.html',        icon: '✅' },
    { label: 'Timetable',     href: 'timetable.html',         icon: '📅' },
    { label: 'Examinations',  href: 'student-dashboard.html#exams', icon: '📝' },
    { section: 'Services' },
    { label: 'Fee Payment',   href: 'fee-management.html',    icon: '💰' },
    { label: 'Library',       href: 'library.html',           icon: '📚' },
    { label: 'Hostel',        href: 'hostel.html',            icon: '🏠' },
    { label: 'Notifications', href: 'notifications.html',     icon: '🔔', badge: '0' },
    { section: 'Account' },
    { label: 'Profile',       href: 'profile.html',           icon: '👤' },
  ],
  Faculty: [
    { section: 'Overview' },
    { label: 'Dashboard',     href: 'faculty-dashboard.html', icon: '⊞' },
    { section: 'Teaching' },
    { label: 'Attendance',    href: 'attendance.html',        icon: '✅' },
    { label: 'Timetable',     href: 'timetable.html',         icon: '📅' },
    { label: 'Examinations',  href: 'faculty-dashboard.html#exams', icon: '📝' },
    { section: 'Requests' },
    { label: 'Leave Requests',href: 'faculty-dashboard.html#leaves', icon: '📋' },
    { label: 'Notifications', href: 'notifications.html',     icon: '🔔', badge: '0' },
    { section: 'Account' },
    { label: 'Profile',       href: 'profile.html',           icon: '👤' },
  ],
};

function buildSidebar(role) {
  const nav = SIDEBAR_NAV[role] || SIDEBAR_NAV.Admin;
  const currentPage = window.location.pathname.split('/').pop().split('#')[0];

  let html = `
  <div id="sidebar-overlay" class="sidebar-overlay"></div>
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
      </div>
      <span class="sidebar-logo-text">SCMS</span>
    </div>
    <nav class="sidebar-nav">`;

  nav.forEach(item => {
    if (item.section) {
      html += `<div class="nav-section-label">${item.section}</div>`;
    } else {
      const pageName = item.href.split('/').pop().split('#')[0];
      const isActive = pageName === currentPage ? 'active' : '';
      html += `<a class="nav-item ${isActive}" href="${item.href}">
        <span class="nav-item-icon">${item.icon}</span>
        <span class="nav-item-label">${item.label}</span>
        ${item.badge !== undefined ? `<span class="nav-badge" id="badge-${item.label.replace(/\s/g,'-').toLowerCase()}">${item.badge}</span>` : ''}
      </a>`;
    }
  });

  html += `
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="user-avatar" id="sidebar-avatar"></div>
        <div class="user-info">
          <div class="user-name" id="sidebar-user-name">Loading...</div>
          <div class="user-role" id="sidebar-user-role">${role}</div>
        </div>
      </div>
      <button id="logout-btn" style="width:100%;margin-top:8px;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.5);border:none;border-radius:8px;padding:8px;font-size:0.78rem;cursor:pointer;transition:all 0.2s">
        Sign Out
      </button>
    </div>
  </aside>`;

  return html;
}

function injectSidebar(role) {
  const wrapper = document.getElementById('sidebar-wrapper');
  if (wrapper) wrapper.innerHTML = buildSidebar(role);
}
