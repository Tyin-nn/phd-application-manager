// === Page 4: Letter Assignment Overview (推荐信分配总览) ===
function renderLetterOverview() {
  const activePrograms = AppState.programs.filter(p => p.status === 'active');
  const recommenders = AppState.recommenders;

  let html = '';

  if (activePrograms.length === 0) {
    html += '<div class="empty-state"><div class="empty-icon">📨</div><p>暂无活跃的申请项目</p></div>';
    renderPage('推荐信分配总览', '查看推荐人与项目的分配矩阵', html);
    return;
  }

  if (recommenders.length === 0) {
    html += '<div class="empty-state"><div class="empty-icon">👤</div><p>暂无推荐人，<a href="#/recommenders">去添加 →</a></p></div>';
    renderPage('推荐信分配总览', '查看推荐人与项目的分配矩阵', html);
    return;
  }

  // Matrix table
  html += '<div class="table-wrap">';
  html += '<table class="matrix-table">';
  html += '<thead><tr><th>项目 \\ 推荐人</th>';
  recommenders.forEach(r => {
    html += `<th>${escapeHtml(r.name || '(未命名)')}<br><span style="font-weight:400;font-size:0.65rem;text-transform:none;">${escapeHtml((r.title || '—').substring(0, 15))}</span></th>`;
  });
  html += '<th style="text-align:center;">已分配</th>';
  html += '</tr></thead><tbody>';

  activePrograms.forEach(p => {
    html += '<tr>';
    html += `<td style="text-align:left;"><div style="font-weight:500;">${escapeHtml(p.institution)}</div><div style="font-size:0.72rem;color:var(--gray-500);">${escapeHtml(p.country)}</div></td>`;

    let assignedCount = 0;
    recommenders.forEach(r => {
      const isAssigned = (r.assignedProgramIds || []).includes(p.id);
      if (isAssigned) assignedCount++;
      html += `<td style="text-align:center;">`;
      html += `<button class="matrix-cell${isAssigned ? ' assigned' : ''}" onclick="toggleMatrixCell('${r.id}','${p.id}')" title="${escapeHtml(r.name || '')} ↔ ${escapeHtml(p.institution)}">`;
      html += isAssigned ? '✓' : '';
      html += '</button>';
      html += '</td>';
    });

    // Warning if less than 2 recommenders
    html += '<td style="text-align:center;">';
    if (assignedCount === 0) {
      html += '<span class="text-danger" style="font-size:0.78rem;">⚠ 未分配</span>';
    } else if (assignedCount < 2) {
      html += `<span class="text-warning" style="font-size:0.78rem;">${assignedCount}/2+ 偏少</span>`;
    } else {
      html += `<span style="font-size:0.78rem;color:var(--success);">${assignedCount} ✓</span>`;
    }
    html += '</td></tr>';
  });

  html += '</tbody></table></div>';

  // Summary section
  html += '<div class="section mt-4">';
  html += '<div class="section-title">📊 分配统计</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">';
  recommenders.forEach(r => {
    const count = (r.assignedProgramIds || []).length;
    const maxPossible = activePrograms.length;
    html += `<div class="card" style="padding:14px;">`;
    html += `<div style="font-weight:600;">${escapeHtml(r.name || '(未命名)')}</div>`;
    html += `<div style="font-size:0.8rem;color:var(--gray-500);">${count} / ${maxPossible} 个项目</div>`;
    html += `<div class="progress-bar mt-2"><div class="progress-fill" style="width:${maxPossible > 0 ? Math.round(count/maxPossible*100) : 0}%;"></div></div>`;
    html += '</div>';
  });
  html += '</div></div>';

  // Letter requirements check
  html += '<div class="section mt-4">';
  html += '<div class="section-title">⚠️ 推荐信需求检查</div>';
  const programsNeedingLetters = activePrograms.filter(p => {
    const count = AppState.recommenders.filter(r => (r.assignedProgramIds || []).includes(p.id)).length;
    return count < 2;
  });
  if (programsNeedingLetters.length === 0) {
    html += '<p class="text-success">所有项目至少有 2 位推荐人 ✓</p>';
  } else {
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
    programsNeedingLetters.forEach(p => {
      const count = AppState.recommenders.filter(r => (r.assignedProgramIds || []).includes(p.id)).length;
      html += `<div class="card" style="padding:10px 14px;border-color:${count === 0 ? 'var(--danger)' : 'var(--warning)'};">`;
      html += `<strong>${escapeHtml(p.institution)}</strong>`;
      html += `<span style="font-size:0.78rem;margin-left:8px;color:${count === 0 ? 'var(--danger)' : 'var(--warning)'};">${count} 位推荐人</span>`;
      html += '</div>';
    });
    html += '</div>';
  }
  html += '</div>';

  renderPage('推荐信分配总览', '查看推荐人与项目的分配矩阵', html);
}

window.toggleMatrixCell = function (recId, progId) {
  AppState.toggleRecommenderAssignment(recId, progId);
  showToast('已更新');
  renderLetterOverview();
};
