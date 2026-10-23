// === Page 2: Program List (申请总览) ===
const PROGRAM_VIEW_KEY = 'phd_program_view';

function getProgramView() {
  return localStorage.getItem(PROGRAM_VIEW_KEY) === 'flat' ? 'flat' : 'region';
}

window.setProgramView = function (view) {
  localStorage.setItem(PROGRAM_VIEW_KEY, view);
  document.querySelectorAll('[data-program-view]').forEach(btn => {
    const active = btn.getAttribute('data-program-view') === view;
    btn.classList.toggle('btn-primary', active);
    btn.classList.toggle('btn-secondary', !active);
  });
  filterPrograms();
};

function renderCountryOptions(preferred) {
  const region = document.getElementById('prog-filter-region')?.value || '';
  const select = document.getElementById('prog-filter-country');
  if (!select) return;
  const countries = [...new Set(AppState.programs
    .filter(p => !region || regionOf(p.country) === region)
    .map(p => p.country))].sort();
  const current = preferred !== undefined ? preferred : select.value;
  const keep = countries.includes(current) ? current : '';
  let html = `<option value=""${keep ? '' : ' selected'}>全部国家</option>`;
  countries.forEach(c => {
    html += `<option value="${escapeHtml(c)}"${c === keep ? ' selected' : ''}>${escapeHtml(c)}</option>`;
  });
  select.innerHTML = html;
}

window.onProgramRegionChange = function () {
  renderCountryOptions();
  filterPrograms();
};

function renderProgramList() {
  let html = '';

  // Filters
  html += '<div class="filters-bar">';
  html += '<input class="form-input search-input" id="prog-search" placeholder="🔍 搜索学校或地区..." oninput="filterPrograms()">';
  html += '<select class="form-select" id="prog-filter-region" onchange="onProgramRegionChange()">';
  html += '<option value="">全部地区</option>';
  const regions = [...new Set(AppState.programs.map(p => regionOf(p.country)))]
    .sort((a, b) => regionSortIndex(a) - regionSortIndex(b));
  regions.forEach(r => { html += `<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`; });
  html += '</select>';
  html += '<select class="form-select" id="prog-filter-country" onchange="filterPrograms()">';
  html += '<option value="">全部国家</option>';
  const countries = [...new Set(AppState.programs.map(p => p.country))].sort();
  countries.forEach(c => { html += `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`; });
  html += '</select>';
  html += '<select class="form-select" id="prog-filter-tier" onchange="filterPrograms()">';
  html += '<option value="">全部档次</option>';
  html += '<option value="冲刺">冲刺</option><option value="核心">核心</option><option value="保底">保底</option><option value="__empty__">未分类</option>';
  html += '</select>';
  html += '<select class="form-select" id="prog-filter-status" onchange="filterPrograms()">';
  html += '<option value="">全部状态</option>';
  html += '<option value="active">申请中</option><option value="paused">暂不申请</option>';
  html += '</select>';
  html += '<select class="form-select" id="prog-filter-appstatus" onchange="filterPrograms()">';
  html += `<option value="">全部阶段</option>`;
  APP_STATUSES.forEach(s => { html += `<option value="${s.value}">${s.label}</option>`; });
  html += '</select>';
  html += `<button class="btn btn-primary btn-sm" onclick="openProgramEditModal(null)">+ 添加项目</button>`;
  const view = getProgramView();
  html += '<div class="view-toggle">';
  html += `<button class="btn btn-sm ${view === 'flat' ? 'btn-primary' : 'btn-secondary'}" data-program-view="flat" onclick="setProgramView('flat')">平铺</button>`;
  html += `<button class="btn btn-sm ${view === 'region' ? 'btn-primary' : 'btn-secondary'}" data-program-view="region" onclick="setProgramView('region')">按地区</button>`;
  html += '</div>';
  html += '</div>';

  html += '<div id="program-list"></div>';

  renderPage('申请总览', '浏览和管理所有 PhD 申请项目', html);
  filterPrograms();
}

function filterPrograms() {
  const search = (document.getElementById('prog-search')?.value || '').toLowerCase();
  const region = document.getElementById('prog-filter-region')?.value || '';
  const country = document.getElementById('prog-filter-country')?.value || '';
  const tier = document.getElementById('prog-filter-tier')?.value || '';
  const status = document.getElementById('prog-filter-status')?.value || '';
  const appStatus = document.getElementById('prog-filter-appstatus')?.value || '';

  let filtered = AppState.programs;

  if (search) {
    filtered = filtered.filter(p =>
      p.institution.toLowerCase().includes(search) ||
      p.country.toLowerCase().includes(search) ||
      regionOf(p.country).toLowerCase().includes(search) ||
      (p.researchDirection || '').toLowerCase().includes(search) ||
      (p.location || '').toLowerCase().includes(search)
    );
  }
  if (region) filtered = filtered.filter(p => regionOf(p.country) === region);
  if (country) filtered = filtered.filter(p => p.country === country);
  if (tier === '__empty__') filtered = filtered.filter(p => !p.tier);
  else if (tier) filtered = filtered.filter(p => p.tier === tier);
  if (status) filtered = filtered.filter(p => p.status === status);
  if (appStatus) filtered = filtered.filter(p => (p.appStatus || '未开始') === appStatus);

  const container = document.getElementById('program-list');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>暂无匹配的申请项目</p></div>`;
    return;
  }

  if (getProgramView() === 'flat') {
    container.innerHTML = `<div class="program-grid">${filtered.map(p => renderProgramCard(p)).join('')}</div>`;
    return;
  }

  const groups = new Map();
  filtered.forEach(p => {
    const r = regionOf(p.country);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(p);
  });

  const orderedRegions = [...groups.keys()].sort((a, b) => regionSortIndex(a) - regionSortIndex(b));
  container.innerHTML = orderedRegions.map(r => {
    const items = groups.get(r);
    return `<div class="region-group">
      <div class="region-group-header"><h3>${escapeHtml(r)}</h3><span class="count">${items.length} 个项目</span></div>
      <div class="program-grid">${items.map(p => renderProgramCard(p)).join('')}</div>
    </div>`;
  }).join('');
}
