// === Page 3: Materials Checklist (材料清单) ===
function renderMaterials() {
  const programs = AppState.programs.filter(p => p.status === 'active');

  // Build filter options
  let html = '<div class="filters-bar">';
  html += '<select class="form-select" id="mat-filter-program" onchange="renderMaterialDetail()">';
  html += '<option value="">选择学校...</option>';
  programs.forEach(p => {
    html += `<option value="${p.id}">${escapeHtml(p.institution)} (${escapeHtml(p.country)})</option>`;
  });
  html += '</select>';
  html += '<select class="form-select" id="mat-filter-status" onchange="renderMaterialDetail()">';
  html += '<option value="">全部状态</option>';
  html += '<option value="未开始">未开始</option><option value="进行中">进行中</option><option value="已完成">已完成</option><option value="不适用">不适用</option>';
  html += '</select>';
  html += '</div>';

  html += '<div id="material-detail"></div>';

  renderPage('材料清单', '管理每个申请项目的材料准备进度', html);

  // Auto-select the focused program if set
  const focusId = AppState._focusProgram;
  if (focusId) {
    const sel = document.getElementById('mat-filter-program');
    if (sel) {
      sel.value = focusId;
      AppState._focusProgram = null;
    }
  }

  renderMaterialDetail();
}

function renderMaterialDetail() {
  const programId = document.getElementById('mat-filter-program')?.value;
  const statusFilter = document.getElementById('mat-filter-status')?.value || '';
  const container = document.getElementById('material-detail');
  if (!container) return;

  if (!programId) {
    // Show all programs summary
    const programs = AppState.programs.filter(p => p.status === 'active');
    if (programs.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><p>暂无活跃的申请项目</p></div>';
      return;
    }
    let html = '<div style="display:grid;gap:16px;">';
    programs.forEach(p => {
      const progress = AppState.getProgramMaterialProgress(p.id);
      const mats = AppState.getMaterials(p.id);
      const done = mats.filter(m => m.status === '已完成').length;
      const total = mats.filter(m => m.status !== '不适用').length;
      html += `<div class="card" style="padding:16px;">`;
      html += `<div style="display:flex;justify-content:space-between;align-items:center;">`;
      html += `<div><strong>${escapeHtml(p.institution)}</strong> <span class="text-muted">${escapeHtml(p.country)}</span></div>`;
      html += `<div><span style="font-weight:600;">${progress}%</span> <span class="text-muted">(${done}/${total})</span></div>`;
      html += `</div>`;
      html += `<div class="progress-bar mt-2"><div class="progress-fill" style="width:${progress}%;"></div></div>`;
      html += `</div>`;
    });
    html += '</div>';
    container.innerHTML = html;
    return;
  }

  const program = AppState.getProgram(programId);
  if (!program) return;

  let mats = AppState.getMaterials(programId);
  if (statusFilter) {
    mats = mats.filter(m => m.status === statusFilter);
  }

  const progress = AppState.getProgramMaterialProgress(programId);

  let html = '';
  html += `<div class="card mb-4">`;
  html += `<div class="flex-between mb-3">`;
  html += `<div><strong>${escapeHtml(program.institution)}</strong> <span class="text-muted">${escapeHtml(program.country)}</span></div>`;
  html += `<span style="font-size:1.2rem;font-weight:700;">${progress}%</span>`;
  html += `</div>`;
  html += renderProgressBar(progress);
  html += `</div>`;

  // Material grid
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;">';
  mats.forEach(m => {
    html += '<div class="card" style="padding:14px;">';
    html += `<div class="flex-between mb-2">`;
    html += `<strong style="font-size:0.9rem;">${escapeHtml(m.label)}</strong>`;
    html += `<select class="form-select btn-sm" style="width:auto;" onchange="updateMaterialStatus('${programId}','${m.id}',this.value)" data-mat-id="${m.id}">`;
    ['未开始', '进行中', '已完成', '不适用'].forEach(s => {
      html += `<option value="${s}" ${m.status === s ? 'selected' : ''}>${statusLabel(s)}</option>`;
    });
    html += '</select>';
    html += '</div>';
    html += `<textarea class="form-textarea" style="font-size:0.8rem;min-height:50px;" placeholder="备注..." onchange="updateMaterialNotes('${programId}','${m.id}',this.value)">${escapeHtml(m.notes || '')}</textarea>`;
    html += '</div>';
  });
  html += '</div>';

  // Synced: Letter assignment
  html += '<div class="section mt-4">';
  html += '<div class="section-title">📨 推荐信分配</div>';
  const assignedRecs = AppState.getRecommendersForProgram(programId);
  if (assignedRecs.length === 0) {
    html += '<p class="text-muted">暂无推荐人分配到此项目。<a href="#/letter-assign">去分配 →</a></p>';
  } else {
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
    assignedRecs.forEach(r => {
      html += `<span class="tag tag-tier-core">${escapeHtml(r.name || '(未命名)')} — ${escapeHtml(r.title || r.institution || '—')}</span>`;
    });
    html += '</div>';
  }
  html += '</div>';

  // Contact records (套磁记录)
  const contacts = program.contacts || [];
  html += '<div class="section mt-4">';
  html += '<div class="flex-between mb-2">';
  html += '<div class="section-title" style="margin:0;">📮 套磁联系记录</div>';
  html += `<button class="btn btn-sm btn-primary" onclick="openContactModal('${programId}')">+ 添加记录</button>`;
  html += '</div>';
  if (contacts.length === 0) {
    html += '<p class="text-muted">暂无联系记录。套磁后在此记录教授、时间和回复情况。</p>';
  } else {
    html += '<div style="display:grid;gap:10px;">';
    contacts.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).forEach(c => {
      html += `<div class="contact-record">`;
      html += `<div class="contact-main">`;
      html += `<div><strong>${escapeHtml(c.professor || '(未填教授)')}</strong> <span class="text-muted" style="font-size:0.78rem;">${c.email ? '· ' + escapeHtml(c.email) : ''}</span></div>`;
      html += `<div style="font-size:0.78rem;margin-top:4px;">`;
      html += `<span class="tag tag-reply-${replyStatusClass(c.replyStatus)}">${escapeHtml(c.replyStatus || '未回复')}</span>`;
      if (c.date) html += ` <span class="text-muted">${formatDate(c.date)}</span>`;
      if (c.method) html += ` <span class="text-muted">· ${escapeHtml(c.method)}</span>`;
      html += `</div>`;
      if (c.notes) html += `<div class="text-muted" style="font-size:0.8rem;margin-top:6px;">${escapeHtml(c.notes)}</div>`;
      html += `</div>`;
      html += `<button class="btn btn-sm btn-ghost text-danger" onclick="removeContactRecord('${programId}','${c.id}')" title="删除记录">✕</button>`;
      html += `</div>`;
    });
    html += '</div>';
  }
  html += '</div>';

  container.innerHTML = html;
}

const REPLY_STATUSES = ['未回复', '已回复', '约面'];
function replyStatusClass(s) {
  return { '未回复': 'none', '已回复': 'replied', '约面': 'meeting' }[s] || 'none';
}

window.openContactModal = function (programId) {
  Modal.show({
    title: '添加套磁记录',
    body: `
      <div class="form-group"><label class="form-label">教授姓名 *</label><input class="form-input" id="ct-professor" placeholder="e.g. Kasper Heintz"></div>
      <div class="form-group"><label class="form-label">邮箱</label><input type="email" class="form-input" id="ct-email" placeholder="email@example.com"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label class="form-label">联系日期</label><input type="date" class="form-input" id="ct-date" value="${new Date().toISOString().slice(0, 10)}"></div>
        <div class="form-group"><label class="form-label">方式</label>
          <select class="form-select" id="ct-method">
            <option value="Email">Email</option>
            <option value="官网申请">官网申请</option>
            <option value="会议/线下">会议/线下</option>
            <option value="其他">其他</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">回复状态</label>
        <select class="form-select" id="ct-reply">
          ${REPLY_STATUSES.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">备注</label><textarea class="form-textarea" id="ct-notes" rows="3" placeholder="邮件内容摘要、回复内容、下一步计划..."></textarea></div>
    `,
    saveLabel: '保存记录',
    onSave: () => {
      const professor = document.getElementById('ct-professor').value.trim();
      if (!professor) { alert('请填写教授姓名'); return; }
      AppState.addContact(programId, {
        professor,
        email: document.getElementById('ct-email').value.trim(),
        date: document.getElementById('ct-date').value,
        method: document.getElementById('ct-method').value,
        replyStatus: document.getElementById('ct-reply').value,
        notes: document.getElementById('ct-notes').value.trim(),
      });
      Modal.hide();
      showToast('已添加联系记录');
      renderMaterialDetail();
    },
  });
};

window.removeContactRecord = async function (programId, contactId) {
  const ok = await confirmAction('确定删除此联系记录？');
  if (ok) {
    AppState.removeContact(programId, contactId);
    showToast('已删除');
    renderMaterialDetail();
  }
};

window.updateMaterialStatus = function (programId, materialId, status) {
  AppState.updateMaterial(programId, materialId, { status });
  // Re-render the detail view (keep program selected)
  const sel = document.getElementById('mat-filter-program');
  // Re-render just the material section
  renderMaterialDetail();
};

window.updateMaterialNotes = function (programId, materialId, notes) {
  AppState.updateMaterial(programId, materialId, { notes });
};
