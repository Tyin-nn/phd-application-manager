// === Page 8: Recommender Detail (推荐人详情) ===
function renderRecommenderDetail(id) {
  const rec = AppState.getRecommender(id);
  if (!rec) {
    renderPage('推荐人详情', '', '<div class="empty-state"><div class="empty-icon">👤</div><p>推荐人不存在</p></div>');
    return;
  }

  let html = '';

  // Form
  html += '<div class="card mb-4">';
  html += '<h3 style="margin-bottom:16px;">推荐人信息</h3>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
  html += `<div class="form-group"><label class="form-label">姓名</label><input class="form-input" id="rec-name" value="${escapeHtml(rec.name || '')}" placeholder="推荐人姓名" onchange="saveRecField('${id}')"></div>`;
  html += `<div class="form-group"><label class="form-label">职称</label><input class="form-input" id="rec-title" value="${escapeHtml(rec.title || '')}" placeholder="教授/副教授..." onchange="saveRecField('${id}')"></div>`;
  html += `<div class="form-group"><label class="form-label">机构</label><input class="form-input" id="rec-institution" value="${escapeHtml(rec.institution || '')}" placeholder="所在机构" onchange="saveRecField('${id}')"></div>`;
  html += `<div class="form-group"><label class="form-label">邮箱</label><input type="email" class="form-input" id="rec-email" value="${escapeHtml(rec.email || '')}" placeholder="email@example.com" onchange="saveRecField('${id}')"></div>`;
  html += `<div class="form-group"><label class="form-label">电话</label><input class="form-input" id="rec-phone" value="${escapeHtml(rec.phone || '')}" placeholder="(optional)" onchange="saveRecField('${id}')"></div>`;
  html += '</div>';
  html += `<div class="form-group"><label class="form-label">备注</label><textarea class="form-textarea" id="rec-notes" rows="3" placeholder="推荐人与你的关系、注意事项等" onchange="saveRecField('${id}')">${escapeHtml(rec.notes || '')}</textarea></div>`;
  html += '</div>';

  // Assigned programs
  const assignedPrograms = AppState.programs.filter(p =>
    (rec.assignedProgramIds || []).includes(p.id)
  );

  html += '<div class="card">';
  html += `<h3 style="margin-bottom:16px;">已分配项目 (${assignedPrograms.length})</h3>`;
  if (assignedPrograms.length === 0) {
    html += '<p class="text-muted">尚未分配任何项目。<a href="#/letter-assign">去分配 →</a></p>';
  } else {
    html += '<div class="program-grid">';
    assignedPrograms.forEach(p => {
      html += renderProgramCardCompact(p);
    });
    html += '</div>';
  }
  html += '</div>';

  renderPage(rec.name || '推荐人详情', '编辑推荐人信息', html);
}

window.saveRecField = function (id) {
  const data = {
    name: document.getElementById('rec-name')?.value || '',
    title: document.getElementById('rec-title')?.value || '',
    institution: document.getElementById('rec-institution')?.value || '',
    email: document.getElementById('rec-email')?.value || '',
    phone: document.getElementById('rec-phone')?.value || '',
    notes: document.getElementById('rec-notes')?.value || '',
  };
  AppState.updateRecommender(id, data);
};
