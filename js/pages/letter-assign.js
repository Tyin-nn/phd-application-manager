// === Page 9: Letter Assignment Management (推荐信分配管理) ===
function renderLetterAssign() {
  const activePrograms = AppState.programs.filter(p => p.status === 'active');

  let html = '<div class="two-col">';

  // Left: Recommender list
  html += '<div class="col-list">';
  html += '<h3 style="margin-bottom:12px;">推荐人</h3>';
  if (AppState.recommenders.length === 0) {
    html += '<p class="text-muted">暂无推荐人</p>';
  } else {
    AppState.recommenders.forEach(r => {
      const count = (r.assignedProgramIds || []).length;
      html += `<div class="selectable-item flex-between" id="assign-rec-${r.id}" onclick="selectAssignRecommender('${r.id}')">`;
      html += `<span>${escapeHtml(r.name || '(未命名)')}</span>`;
      html += `<span class="letter-count">${count}</span>`;
      html += '</div>';
    });
  }
  html += '</div>';

  // Right: Program checkboxes
  html += '<div class="col-detail">';
  html += '<h3 style="margin-bottom:12px;" id="assign-title">选择推荐人后分配项目</h3>';
  if (activePrograms.length === 0) {
    html += '<p class="text-muted">暂无活跃的申请项目</p>';
  } else {
    html += '<div class="checkbox-list" id="assign-program-list">';
    activePrograms.forEach(p => {
      html += `<div class="checkbox-item" id="assign-item-${p.id}" onclick="toggleAssignProgram('${p.id}')">`;
      html += `<input type="checkbox" id="assign-cb-${p.id}" disabled>`;
      html += `<div>`;
      html += `<div style="font-weight:500;">${escapeHtml(p.institution)}</div>`;
      html += `<div style="font-size:0.75rem;color:var(--gray-500);">${escapeHtml(p.country)} · ${escapeHtml(p.tier || '未分类')}</div>`;
      html += `</div>`;
      html += '</div>';
    });
    html += '</div>';
  }
  html += '</div>';

  html += '</div>'; // two-col

  renderPage('推荐信分配管理', '管理每位推荐人的分配项目', html);

  // Init state
  window._assignSelectedRec = null;
}

window.selectAssignRecommender = function (recId) {
  window._assignSelectedRec = recId;

  // Update UI
  document.querySelectorAll('.selectable-item').forEach(el => el.classList.remove('active'));
  const recEl = document.getElementById('assign-rec-' + recId);
  if (recEl) recEl.classList.add('active');

  // Update title
  const rec = AppState.getRecommender(recId);
  document.getElementById('assign-title').textContent = `分配给: ${rec.name || '(未命名)'}`;

  // Update checkboxes
  const assignedIds = rec.assignedProgramIds || [];
  const activePrograms = AppState.programs.filter(p => p.status === 'active');
  activePrograms.forEach(p => {
    const item = document.getElementById('assign-item-' + p.id);
    const cb = document.getElementById('assign-cb-' + p.id);
    if (item && cb) {
      cb.checked = assignedIds.includes(p.id);
      item.classList.toggle('checked', cb.checked);
    }
  });
};

window.toggleAssignProgram = function (programId) {
  if (!window._assignSelectedRec) {
    showToast('请先选择一位推荐人');
    return;
  }
  AppState.toggleRecommenderAssignment(window._assignSelectedRec, programId);
  // Refresh UI
  selectAssignRecommender(window._assignSelectedRec);
  showToast('已更新');
};
