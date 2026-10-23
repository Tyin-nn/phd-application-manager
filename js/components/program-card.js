// === Program Card Component ===
function renderProgramCard(program, opts = {}) {
  const { showActions = true, compact = false } = opts;
  const isPaused = program.status === 'paused';

  let html = `<div class="program-card${isPaused ? ' paused' : ''}" data-program-id="${program.id}">`;

  // Header
  html += `<div class="card-country">${escapeHtml(program.country)}</div>`;
  html += `<div class="card-institution">${escapeHtml(program.institution)}</div>`;
  if (program.researchDirection) {
    html += `<div class="card-direction">${escapeHtml(program.researchDirection)}</div>`;
  }
  if (program.matchingNotes) {
    html += `<div class="text-muted" style="font-size:0.8rem;">${escapeHtml(program.matchingNotes)}</div>`;
  }

  // Meta tags
  html += '<div class="card-meta">';
  if (program.tier) {
    html += `<span class="tag tag-tier-${tierClass(program.tier)}">${tierLabel(program.tier)}</span>`;
  }
  html += `<span class="tag tag-status-${isPaused ? 'paused' : 'active'}">${programStatusLabel(program.status)}</span>`;
  html += `<span class="app-status app-status-${appStatusClass(program.appStatus)}" title="申请阶段">
    <select class="app-status-select" onchange="changeAppStatus('${program.id}', this.value)" onclick="event.stopPropagation()">
      ${APP_STATUSES.map(s => `<option value="${s.value}" ${(program.appStatus || '未开始') === s.value ? 'selected' : ''}>${s.label}</option>`).join('')}
    </select>
  </span>`;
  const contactCount = (program.contacts || []).length;
  if (contactCount > 0) {
    html += `<span class="tag tag-contact" title="套磁联系记录">📮 已联系 ${contactCount} 人</span>`;
  }
  if (program.deadline) {
    const days = daysUntil(program.deadline);
    const isUrgent = isFinite(days) && days <= 14;
    html += `<span class="tag${isUrgent ? ' tag-urgent-deadline' : ''}" style="${isUrgent ? '' : 'background:var(--gray-100);'}">📅 ${formatDate(program.deadline)}${isFinite(days) ? (days > 0 ? ` · ${days}天` : days === 0 ? ' · 今天' : '') : ''}</span>`;
  }
  if (program.location) {
    html += `<span class="tag" style="background:var(--gray-100);">📍 ${escapeHtml(program.location)}</span>`;
  }
  if (program.funding) {
    html += `<span class="tag" style="background:var(--gray-100);">💰 ${escapeHtml(program.funding)}</span>`;
  }
  html += '</div>';

  // Progress bar
  if (!compact) {
    const progress = AppState.getProgramMaterialProgress(program.id);
    html += '<div style="margin-top:12px;">';
    html += '<div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:4px;">';
    html += `<span class="text-muted">材料准备</span><span style="font-weight:600;">${progress}%</span>`;
    html += '</div>';
    html += `<div class="progress-bar"><div class="progress-fill" style="width:${progress}%;"></div></div>`;
    html += '</div>';
  }

  // Actions
  if (showActions) {
    html += '<div class="card-actions">';
    html += `<button class="btn btn-sm btn-secondary" onclick="Router.navigate('/materials');AppState._focusProgram='${program.id}';">材料</button>`;
    html += `<button class="btn btn-sm btn-secondary" onclick="openProgramEditModal('${program.id}')">编辑</button>`;
    if (!isPaused) {
      html += `<button class="btn btn-sm btn-ghost" onclick="toggleProgramPause('${program.id}')">暂不申请</button>`;
    } else {
      html += `<button class="btn btn-sm btn-ghost" onclick="toggleProgramPause('${program.id}')">恢复申请</button>`;
    }
    html += `<button class="btn btn-sm btn-ghost text-danger" onclick="deleteProgramConfirm('${program.id}')">删除</button>`;
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function renderProgramCardCompact(program) {
  return renderProgramCard(program, { showActions: false, compact: true });
}

// === Global handlers (needed by program cards rendered inline) ===
window.changeAppStatus = function (id, status) {
  AppState.updateProgram(id, { appStatus: status });
  showToast(`申请阶段: ${appStatusLabel(status)}`);
  Router.resolve();
};

window.toggleProgramPause = function (id) {
  const p = AppState.getProgram(id);
  const newStatus = p.status === 'paused' ? 'active' : 'paused';
  AppState.updateProgram(id, { status: newStatus });
  showToast(newStatus === 'paused' ? '已设为暂不申请' : '已恢复申请');
  Router.resolve();
};

window.deleteProgramConfirm = async function (id) {
  const ok = await confirmAction('确定删除此申请项目？此操作不可撤销。');
  if (ok) {
    AppState.deleteProgram(id);
    showToast('已删除');
    Router.resolve();
  }
};

window.openProgramEditModal = function (id) {
  const program = id ? AppState.getProgram(id) : null;
  Modal.show({
    title: program ? '编辑申请项目' : '添加申请项目',
    body: renderProgramForm(program),
    onSave: () => saveProgramForm(program),
  });
};

window.saveProgramForm = function (program) {
  const data = {
    country: document.getElementById('prog-country').value.trim(),
    institution: document.getElementById('prog-institution').value.trim(),
    researchDirection: document.getElementById('prog-direction').value.trim(),
    matchingNotes: document.getElementById('prog-notes').value.trim(),
    websiteURL: document.getElementById('prog-url').value.trim(),
    deadline: document.getElementById('prog-deadline').value,
    location: document.getElementById('prog-location').value.trim(),
    funding: document.getElementById('prog-funding').value.trim(),
    tier: document.getElementById('prog-tier').value,
    appStatus: document.getElementById('prog-appstatus').value,
  };
  if (!data.institution) {
    alert('请填写学校名称');
    return;
  }
  if (program) {
    AppState.updateProgram(program.id, data);
  } else {
    AppState.addProgram(data);
  }
  Modal.hide();
  showToast(program ? '已更新' : '已添加');
  Router.resolve();
};

function renderProgramForm(program) {
  const p = program || {};
  return `
    <div class="form-group">
      <label class="form-label">国家 *</label>
      <input class="form-input" id="prog-country" value="${escapeHtml(p.country || '')}" placeholder="e.g. Denmark">
    </div>
    <div class="form-group">
      <label class="form-label">学校 *</label>
      <input class="form-input" id="prog-institution" value="${escapeHtml(p.institution || '')}" placeholder="Institution name">
    </div>
    <div class="form-group">
      <label class="form-label">研究方向</label>
      <input class="form-input" id="prog-direction" value="${escapeHtml(p.researchDirection || '')}">
    </div>
    <div class="form-group">
      <label class="form-label">匹配备注</label>
      <textarea class="form-textarea" id="prog-notes" rows="2">${escapeHtml(p.matchingNotes || '')}</textarea>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="form-group">
        <label class="form-label">截止日期</label>
        <input type="date" class="form-input" id="prog-deadline" value="${escapeHtml(p.deadline || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">城市</label>
        <input class="form-input" id="prog-location" value="${escapeHtml(p.location || '')}">
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="form-group">
        <label class="form-label">资助</label>
        <input class="form-input" id="prog-funding" value="${escapeHtml(p.funding || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">分档</label>
        <select class="form-select" id="prog-tier">
          <option value="">—</option>
          <option value="冲刺" ${p.tier === '冲刺' ? 'selected' : ''}>冲刺</option>
          <option value="核心" ${p.tier === '核心' ? 'selected' : ''}>核心</option>
          <option value="保底" ${p.tier === '保底' ? 'selected' : ''}>保底</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">申请阶段</label>
      <select class="form-select" id="prog-appstatus">
        ${APP_STATUSES.map(s => `<option value="${s.value}" ${(p.appStatus || '未开始') === s.value ? 'selected' : ''}>${s.label}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">网站链接</label>
      <input class="form-input" id="prog-url" value="${escapeHtml(p.websiteURL || '')}" placeholder="https://...">
    </div>
  `;
}
