// === Page 6: Document Editor (文书编辑器) ===
function renderDocEditor(docId) {
  const doc = AppState.getDocument(docId);
  if (!doc) {
    renderPage('文书编辑器', '', '<div class="empty-state"><div class="empty-icon">📝</div><p>文书不存在</p></div>');
    return;
  }

  let html = '<div class="editor-layout">';

  // Left sidebar: metadata + version history
  html += '<div class="editor-sidebar">';
  html += `<h3 style="margin-bottom:12px;">${escapeHtml(doc.title)}</h3>`;

  // Metadata
  html += '<div style="font-size:0.82rem;margin-bottom:16px;">';
  html += `<div class="mb-2"><span class="text-muted">类别：</span>${escapeHtml(doc.category)}</div>`;
  html += `<div class="mb-2"><span class="text-muted">方向：</span>${escapeHtml(doc.direction)}</div>`;
  html += `<div class="mb-2"><span class="text-muted">状态：</span>${escapeHtml(doc.status || '草稿')}</div>`;
  html += '</div>';

  // Requirements
  if (doc.requirements) {
    html += `<div style="font-size:0.82rem;margin-bottom:16px;padding:10px;background:var(--gray-50);border-radius:var(--radius);">`;
    html += `<div class="text-muted mb-2" style="font-weight:600;">要求/备注</div>`;
    html += escapeHtml(doc.requirements);
    html += '</div>';
  }

  // Update metadata button
  html += `<button class="btn btn-sm btn-secondary w-full mb-3" onclick="editDocMeta('${doc.id}')">编辑元数据</button>`;

  // Version history
  html += '<div style="border-top:1px solid var(--gray-200);padding-top:12px;">';
  html += '<div class="flex-between mb-2"><strong style="font-size:0.85rem;">版本历史</strong></div>';
  const versions = doc.versions || [];
  if (versions.length === 0) {
    html += '<p class="text-muted" style="font-size:0.78rem;">暂无版本</p>';
  } else {
    versions.slice().reverse().forEach((v, i) => {
      const actualIdx = versions.length - 1 - i;
      html += `<div class="version-item${i === 0 ? ' current' : ''}" onclick="loadVersion('${doc.id}','${v.id}')">`;
      html += `<div style="font-weight:500;">${escapeHtml(v.label)}</div>`;
      html += `<div style="font-size:0.7rem;color:var(--gray-500);">${formatDate(v.createdAt)}</div>`;
      html += '</div>';
    });
  }
  html += '</div>';
  html += '</div>'; // sidebar

  // Right: editor
  html += '<div class="editor-main">';
  html += '<div class="flex-between mb-3">';
  html += '<div>';
  html += `<span id="doc-autosave-indicator" class="autosave-indicator"></span>`;
  html += `<button class="btn btn-sm btn-primary" onclick="saveDocument('${doc.id}')">💾 保存</button>`;
  html += `<button class="btn btn-sm btn-secondary" style="margin-left:8px;" onclick="saveDocAsNewVersion('${doc.id}')">另存为新版本</button>`;
  html += '</div>';
  html += `<button class="btn btn-sm btn-ghost text-danger" onclick="deleteDocumentConfirm('${doc.id}')">删除文书</button>`;
  html += '</div>';
  html += `<textarea class="form-textarea" id="doc-content" style="min-height:450px;" placeholder="在此编辑..." oninput="onDocContentInput('${doc.id}')">${escapeHtml(doc.content || '')}</textarea>`;
  const content = doc.content || '';
  const words = countWords(content);
  html += `<div class="word-count" id="doc-word-count"><span>词数 ${words}</span> · <span>字符 ${content.length}</span></div>`;
  html += '</div>';

  html += '</div>'; // editor-layout

  window._currentEditingDocId = docId;

  renderPage('文书编辑器', '', html);
}

window.loadVersion = function (docId, versionId) {
  const doc = AppState.getDocument(docId);
  if (!doc) return;
  const ver = (doc.versions || []).find(v => v.id === versionId);
  if (!ver) return;
  const textarea = document.getElementById('doc-content');
  if (textarea) {
    textarea.value = ver.content;
    showToast(`已加载: ${ver.label}`);
  }
};

window.saveDocument = function (docId) {
  const content = document.getElementById('doc-content')?.value || '';
  AppState.updateDocument(docId, { content });
  setAutosaveIndicator('已保存');
  updateWordCount();
};

// === Autosave + word count ===
const _autosaveDoc = debounce((docId, content) => {
  AppState.updateDocument(docId, { content });
  setAutosaveIndicator('已自动保存 ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
}, 800);

function countWords(text) {
  if (!text) return 0;
  const matches = text.trim().match(/[\w'’-]+|[\u4e00-\u9fff]/g);
  return matches ? matches.length : 0;
}

function updateWordCount() {
  const textarea = document.getElementById('doc-content');
  const counter = document.getElementById('doc-word-count');
  if (!textarea || !counter) return;
  const content = textarea.value;
  counter.innerHTML = `<span>词数 ${countWords(content)}</span> · <span>字符 ${content.length}</span>`;
}

function setAutosaveIndicator(text) {
  const el = document.getElementById('doc-autosave-indicator');
  if (el) el.textContent = text;
}

window.onDocContentInput = function (docId) {
  const textarea = document.getElementById('doc-content');
  if (!textarea) return;
  updateWordCount();
  setAutosaveIndicator('编辑中...');
  _autosaveDoc(docId, textarea.value);
};

// Flush pending autosave when leaving the editor (route change or tab close)
window.addEventListener('hashchange', () => {
  const textarea = document.getElementById('doc-content');
  if (textarea && window._currentEditingDocId) {
    AppState.updateDocument(window._currentEditingDocId, { content: textarea.value });
    window._currentEditingDocId = null;
  }
});

window.addEventListener('beforeunload', () => {
  const textarea = document.getElementById('doc-content');
  if (textarea && window._currentEditingDocId) {
    AppState.updateDocument(window._currentEditingDocId, { content: textarea.value });
    window._currentEditingDocId = null;
  }
});

window.saveDocAsNewVersion = function (docId) {
  const content = document.getElementById('doc-content')?.value || '';
  const doc = AppState.getDocument(docId);
  const label = prompt('版本标签:', `v${(doc.versions || []).length + 1}`);
  if (!label) return;
  AppState.saveDocVersion(docId, content, label);
  showToast(`已保存版本: ${label}`);
  Router.resolve(); // Refresh to show new version
};

window.deleteDocumentConfirm = async function (docId) {
  const ok = await confirmAction('确定删除此文书？此操作不可撤销。');
  if (ok) {
    AppState.deleteDocument(docId);
    showToast('已删除');
    Router.navigate('/documents');
  }
};

window.editDocMeta = function (docId) {
  const doc = AppState.getDocument(docId);
  if (!doc) return;
  Modal.show({
    title: '编辑文书元数据',
    body: `
      <div class="form-group"><label class="form-label">标题</label><input class="form-input" id="edit-doc-title" value="${escapeHtml(doc.title)}"></div>
      <div class="form-group"><label class="form-label">类别</label><input class="form-input" id="edit-doc-cat" value="${escapeHtml(doc.category)}"></div>
      <div class="form-group"><label class="form-label">方向</label><input class="form-input" id="edit-doc-dir" value="${escapeHtml(doc.direction)}"></div>
      <div class="form-group"><label class="form-label">状态</label><select class="form-select" id="edit-doc-status"><option value="草稿" ${doc.status === '草稿' ? 'selected' : ''}>草稿</option><option value="终稿" ${doc.status === '终稿' ? 'selected' : ''}>终稿</option><option value="存档" ${doc.status === '存档' ? 'selected' : ''}>存档</option></select></div>
      <div class="form-group"><label class="form-label">要求/备注</label><textarea class="form-textarea" id="edit-doc-req" rows="2">${escapeHtml(doc.requirements || '')}</textarea></div>
    `,
    onSave: () => {
      AppState.updateDocument(docId, {
        title: document.getElementById('edit-doc-title').value.trim(),
        category: document.getElementById('edit-doc-cat').value.trim(),
        direction: document.getElementById('edit-doc-dir').value.trim(),
        status: document.getElementById('edit-doc-status').value,
        requirements: document.getElementById('edit-doc-req').value.trim(),
      });
      Modal.hide();
      Router.resolve();
    },
  });
};
