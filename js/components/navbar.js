// === Sidebar Navigation ===
function renderNavbar() {
  const links = [
    { href: '#/', icon: '📊', label: '总览', section: '概览' },
    { href: '#/programs', icon: '📋', label: '申请总览', section: null },
    { href: '#/map', icon: '🌍', label: '世界地图', section: null },
    { href: '#/materials', icon: '✅', label: '材料清单', section: null },
    { href: '#/letter-overview', icon: '📨', label: '推荐信分配总览', section: '推荐信' },
    { href: '#/documents', icon: '📝', label: '文书资料库', section: '文书', hideInSection: true },
    { href: '#/recommenders', icon: '👤', label: '推荐人列表', section: '推荐信' },
    { href: '#/letter-assign', icon: '🔗', label: '推荐信分配管理', section: '推荐信' },
  ];

  let html = '';
  html += '<div class="sidebar-brand"><span class="icon">🎓</span><span>PhD Manager</span></div>';
  html += '<nav class="sidebar-nav">';

  let lastSection = null;
  for (const link of links) {
    if (link.section && link.section !== lastSection) {
      html += `<div class="sidebar-section">${escapeHtml(link.section)}</div>`;
      lastSection = link.section;
    }
    html += `<a class="sidebar-link" href="${link.href}">`;
    html += `<span class="icon">${link.icon}</span>`;
    html += `<span>${escapeHtml(link.label)}</span>`;
    html += '</a>';
  }

  html += '</nav>';
  html += '<div class="sidebar-data">';
  html += `<button class="btn btn-sm btn-secondary w-full" style="margin-bottom:8px;" onclick="exportBackup()">⬇ 导出备份</button>`;
  html += `<button class="btn btn-sm btn-secondary w-full" onclick="document.getElementById('import-backup-input').click()">⬆ 导入恢复</button>`;
  html += `<input type="file" id="import-backup-input" accept=".json,application/json" style="display:none;" onchange="importBackupFile(this.files[0]);this.value='';">`;
  html += '</div>';
  html += '<div class="sidebar-footer">PhD Application Manager v1.1</div>';

  document.getElementById('sidebar').innerHTML = html;
  updateNavbarActive();

  // Update active state on click
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      Router.navigate(href.slice(1)); // Remove '#'
    });
  });
}

// Update active state on route change (prefix match so detail routes highlight their section)
function updateNavbarActive() {
  const path = window.location.hash.slice(1) || '/';
  const prefixes = [
    { prefix: '/documents', href: '#/documents' },
    { prefix: '/recommenders', href: '#/recommenders' },
  ];
  let activeHref = null;
  for (const { prefix, href } of prefixes) {
    if (path === prefix || path.startsWith(prefix + '/')) { activeHref = href; break; }
  }
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (activeHref) {
      link.classList.toggle('active', link.getAttribute('href') === activeHref);
    } else {
      const href = '#' + path;
      link.classList.toggle('active', link.getAttribute('href') === href);
    }
  });
}
