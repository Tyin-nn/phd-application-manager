// === Page 1: Dashboard (总览) ===
function renderDashboard() {
  const activePrograms = AppState.programs.filter(p => p.status === 'active');
  const totalPrograms = AppState.programs.length;
  const activeCount = activePrograms.length;

  // Nearest upcoming deadline (prefer future dates over already-passed ones)
  let nearestDeadline = null;
  let nearestDays = Infinity;
  activePrograms.forEach(p => {
    if (p.deadline) {
      const d = daysUntil(p.deadline);
      // Prefer future deadlines; among futures take the soonest, else the most recently passed
      const better = nearestDeadline === null
        || (nearestDays <= 0 && d > 0)
        || ((d > 0) === (nearestDays > 0) && d < nearestDays);
      if (better) { nearestDays = d; nearestDeadline = p; }
    }
  });

  // Overall progress
  const overallProgress = AppState.getOverallProgress();

  // Total recommenders
  const recommenderCount = AppState.recommenders.length;

  let html = '';

  // Stats
  html += '<div class="stats-grid">';
  html += `<div class="stat-card"><div class="stat-label">申请学校总数</div><div class="stat-value">${totalPrograms}</div><div class="stat-sub">${activeCount} 所进行中</div></div>`;
  html += `<div class="stat-card"><div class="stat-label">最近截止日期</div><div class="stat-value">${nearestDeadline ? formatDate(nearestDeadline.deadline) : '—'}</div><div class="stat-sub">${nearestDeadline ? nearestDeadline.institution + ' · ' + (nearestDays > 0 ? `${nearestDays} 天后` : (nearestDays === 0 ? '今天截止' : `已过期 ${Math.abs(nearestDays)} 天`)) : '暂无截止日期'}</div></div>`;
  html += `<div class="stat-card"><div class="stat-label">材料完成率</div><div class="stat-value">${overallProgress}%</div><div class="stat-sub">所有项目平均</div></div>`;
  html += `<div class="stat-card"><div class="stat-label">推荐人</div><div class="stat-value">${recommenderCount}</div><div class="stat-sub">${AppState.recommenders.filter(r => r.name).length} 位已填写</div></div>`;
  html += '</div>';

  // Application stage breakdown
  const stageCounts = {};
  APP_STATUSES.forEach(s => { stageCounts[s.value] = 0; });
  AppState.programs.forEach(p => {
    const s = p.appStatus || '未开始';
    if (s in stageCounts) stageCounts[s]++;
  });
  const stagesWithCount = APP_STATUSES.filter(s => stageCounts[s.value] > 0);
  if (stagesWithCount.length > 0) {
    html += '<div class="stage-strip">';
    stagesWithCount.forEach(s => {
      html += `<div class="stage-pill stage-${s.cls}"><span class="stage-num">${stageCounts[s.value]}</span><span class="stage-label">${s.label}</span></div>`;
    });
    html += '</div>';
  }

  // Upcoming deadlines: future first (soonest → latest), then recently passed
  const upcomingDeadlines = activePrograms
    .filter(p => p.deadline)
    .sort((a, b) => {
      const da = daysUntil(a.deadline), db = daysUntil(b.deadline);
      if ((da > 0) !== (db > 0)) return da > 0 ? -1 : 1;
      return da - db;
    })
    .slice(0, 8);

  if (upcomingDeadlines.length > 0) {
    html += '<div class="section">';
    html += '<div class="section-title">📅 即将到来的截止日期</div>';
    html += '<div class="deadline-list">';
    upcomingDeadlines.forEach(p => {
      const days = daysUntil(p.deadline);
      const urgentClass = days <= 14 ? 'style="color:var(--danger);"' : '';
      const bgClass = days <= 7 ? 'style="border-left:3px solid var(--danger);"' : '';
      html += `<div class="deadline-item" ${bgClass}>`;
      html += `<div class="dl-date" ${urgentClass}>${formatDate(p.deadline)} · ${days > 0 ? days + '天后' : (days === 0 ? '今天' : Math.abs(days) + '天前')}</div>`;
      html += `<div class="dl-name">${escapeHtml(p.institution)}</div>`;
      html += `<div class="dl-meta">${escapeHtml(p.country)} · ${escapeHtml(p.location || '—')}</div>`;
      html += '</div>';
    });
    html += '</div></div>';
  }

  // Programs by tier
  const tiers = ['冲刺', '核心', '保底', ''];
  const tierNames = { '冲刺': '🚀 冲刺', '核心': '🎯 核心', '保底': '🛡️ 保底', '': '📌 未分类' };

  tiers.forEach(tier => {
    const programs = activePrograms.filter(p => p.tier === tier);
    if (programs.length === 0) return;
    html += '<div class="tier-group">';
    html += `<div class="tier-group-header"><h3>${tierNames[tier]}</h3><span class="count">${programs.length} 所学校</span></div>`;
    html += '<div class="program-grid">';
    programs.forEach(p => {
      html += renderProgramCardCompact(p);
    });
    html += '</div></div>';
  });

  renderPage('总览', 'PhD 申请管理概览', html);
}
