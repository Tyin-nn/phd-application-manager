// === Page 5: Document Library (文书资料库) — Q&A 双栏视图 ===

// View state (session-only, 不持久化)
let _qaSelectedId = null;   // 当前选中文书 id
let _qaPractice = false;    // 练习模式开关
let _qaRevealed = false;    // 当前题是否已揭示答案
let _qaEditing = false;     // 右栏就地编辑状态
let _qaSearch = '';         // 搜索词（跨重绘保留）
let _qaCat = '';            // 类别筛选
let _qaDir = '';            // 方向筛选

function renderDocLibrary() {
  let html = '';

  const categories = [...new Set(AppState.documents.map(d => d.category))].sort();
  const directions = [...new Set(AppState.documents.map(d => d.direction))].sort();

  // Filters bar
  html += '<div class="filters-bar">';
  html += `<input class="form-input search-input" id="doc-search" placeholder="🔍 搜索文书..." value="${escapeHtml(_qaSearch)}" oninput="filterDocs()">`;
  html += '<select class="form-select" id="doc-filter-cat" onchange="filterDocs()">';
  html += '<option value="">全部类别</option>';
  categories.forEach(c => { html += `<option value="${escapeHtml(c)}"${c === _qaCat ? ' selected' : ''}>${escapeHtml(c)}</option>`; });
  html += '</select>';
  html += '<select class="form-select" id="doc-filter-dir" onchange="filterDocs()">';
  html += '<option value="">全部方向</option>';
  directions.forEach(d => { html += `<option value="${escapeHtml(d)}"${d === _qaDir ? ' selected' : ''}>${escapeHtml(d)}</option>`; });
  html += '</select>';
  html += `<button class="btn btn-sm ${_qaPractice ? 'btn-primary' : 'btn-secondary'}" onclick="togglePracticeMode()">🎯 练习模式</button>`;
  html += `<button class="btn btn-sm btn-secondary" onclick="randomPickDoc()">🎲 随机抽题</button>`;
  html += `<button class="btn btn-primary btn-sm" onclick="addNewDocument()">+ 新建文书</button>`;
  html += '</div>';

  // Two-pane layout
  html += '<div id="qa-layout" class="two-col">';
  html += '<div id="qa-list" class="col-list"></div>';
  html += '<div id="qa-detail" class="col-detail"></div>';
  html += '</div>';

  renderPage('文书资料库', '管理和编辑申请文书', html);
  filterDocs();
}

function getFilteredDocs() {
  let docs = AppState.documents;
  if (_qaSearch) {
    const q = _qaSearch.toLowerCase();
    docs = docs.filter(d =>
      d.title.toLowerCase().includes(q) ||
      (d.content || '').toLowerCase().includes(q) ||
      (d.requirements || '').toLowerCase().includes(q)
    );
  }
  if (_qaCat) docs = docs.filter(d => d.category === _qaCat);
  if (_qaDir) docs = docs.filter(d => d.direction === _qaDir);
  return docs;
}

// 选中的文档若不在当前筛选结果里，则回退到第一个
function resolveActiveId(docs) {
  return docs.some(d => d.id === _qaSelectedId) ? _qaSelectedId : (docs[0] ? docs[0].id : null);
}

function filterDocs() {
  const searchEl = document.getElementById('doc-search');
  const catEl = document.getElementById('doc-filter-cat');
  const dirEl = document.getElementById('doc-filter-dir');
  if (searchEl) _qaSearch = searchEl.value;
  if (catEl) _qaCat = catEl.value;
  if (dirEl) _qaDir = dirEl.value;

  const layout = document.getElementById('qa-layout');
  if (!layout) return;

  const docs = getFilteredDocs();

  if (docs.length === 0) {
    layout.className = '';
    layout.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><p>暂无匹配的文书</p></div>';
    return;
  }
  layout.className = 'two-col';

  const activeId = resolveActiveId(docs);
  renderQaList(docs, activeId);
  renderQaDetail(AppState.getDocument(activeId));
}

function refreshQaView() {
  const docs = getFilteredDocs();
  if (!docs.length) { filterDocs(); return; }
  const activeId = resolveActiveId(docs);
  renderQaList(docs, activeId);
  renderQaDetail(AppState.getDocument(activeId));
}

// === 左栏：按类别分组的问题列表 ===
function renderQaList(docs, activeId) {
  const list = document.getElementById('qa-list');
  if (!list) return;

  const groups = new Map();
  docs.forEach(d => {
    if (!groups.has(d.category)) groups.set(d.category, []);
    groups.get(d.category).push(d);
  });

  let html = '';
  [...groups.keys()].sort().forEach(cat => {
    const items = groups.get(cat);
    html += `<div class="qa-group-header"><span>${escapeHtml(cat)}</span><span>${items.length}</span></div>`;
    items.forEach(d => {
      const words = countWords(d.content || '');
      html += `
        <div class="selectable-item${d.id === activeId ? ' active' : ''}" onclick="selectQaDoc('${d.id}')">
          <div class="qa-item-title">${escapeHtml(d.title)}</div>
          <div class="qa-item-meta">${escapeHtml(d.status || '草稿')} · ${words} 词</div>
        </div>`;
    });
  });
  list.innerHTML = html;
}

// === 右栏：详情面板（阅读 / 练习遮罩 / 就地编辑）===
function renderQaDetail(doc) {
  const detail = document.getElementById('qa-detail');
  if (!detail) return;
  if (!doc) {
    detail.innerHTML = '<div class="empty-state"><div class="empty-icon">👈</div><p>从左侧选择一个问题</p></div>';
    return;
  }

  let html = '';

  // --- 就地编辑模式 ---
  if (_qaEditing) {
    html += `<h2 style="margin-bottom:12px;">${escapeHtml(doc.title)}</h2>`;
    html += `<textarea class="form-textarea" id="qa-edit-textarea" style="min-height:400px;font-family:var(--font-mono);font-size:0.88rem;line-height:1.7;" placeholder="在此编辑...">${escapeHtml(doc.content || '')}</textarea>`;
    html += '<div class="qa-detail-actions">';
    html += `<button class="btn btn-primary btn-sm" onclick="qaSaveEdit('${doc.id}')">💾 保存</button>`;
    html += `<button class="btn btn-secondary btn-sm" onclick="qaCancelEdit()">取消</button>`;
    html += '</div>';
    detail.innerHTML = html;
    return;
  }

  // --- 阅读视图 ---
  const content = doc.content || '';
  const hasContent = content.trim().length > 0;

  html += `<h2 style="margin-bottom:2px;">${escapeHtml(doc.title)}</h2>`;

  html += '<div class="qa-tags">';
  html += `<span class="qa-tag qa-tag-primary">${escapeHtml(doc.category)}</span>`;
  html += `<span class="qa-tag">${escapeHtml(doc.direction)}</span>`;
  html += `<span class="qa-tag">${escapeHtml(doc.status || '草稿')}</span>`;
  html += `<span class="qa-tag">${countWords(content)} 词</span>`;
  if (_qaPractice) html += '<span class="qa-tag">🎯 练习中</span>';
  html += '</div>';

  if (doc.requirements) {
    html += `<div class="qa-req-box"><strong>要求/备注：</strong>${escapeHtml(doc.requirements)}</div>`;
  }

  const showMask = _qaPractice && !_qaRevealed && hasContent;
  if (showMask) {
    html += '<div class="qa-practice-wrap">';
    html += `<div class="qa-answer qa-masked">${escapeHtml(content)}</div>`;
    html += '<div class="qa-reveal-overlay"><button class="btn btn-primary btn-sm" onclick="revealQaAnswer()">👁 显示答案</button></div>';
    html += '</div>';
  } else {
    html += `<div class="qa-answer">${hasContent ? escapeHtml(content) : '<span class="text-muted">（暂无内容，点击下方「编辑」填写）</span>'}</div>`;
    if (_qaPractice && hasContent) {
      html += '<div class="mt-3"><button class="btn btn-secondary btn-sm" onclick="hideQaAnswer()">🙈 隐藏答案，继续练习</button></div>';
    }
  }

  html += '<div class="qa-detail-actions">';
  html += `<button class="btn btn-primary btn-sm" onclick="qaEditToggle(true)">✏️ 编辑</button>`;
  html += `<button class="btn btn-secondary btn-sm" onclick="Router.navigate('/documents/${doc.id}')">完整编辑器 ↗</button>`;
  html += `<button class="btn btn-ghost btn-sm text-danger" onclick="deleteQaDoc('${doc.id}')">🗑 删除</button>`;
  html += '</div>';

  detail.innerHTML = html;
}

// === Handlers ===

window.selectQaDoc = function (id) {
  _qaSelectedId = id;
  _qaRevealed = false;
  _qaEditing = false;
  refreshQaView();
};

window.togglePracticeMode = function () {
  _qaPractice = !_qaPractice;
  _qaRevealed = false;
  _qaEditing = false;
  renderDocLibrary(); // 整页重绘以刷新按钮高亮；筛选条件已存于模块变量
};

window.randomPickDoc = function () {
  const docs = getFilteredDocs();
  if (!docs.length) { showToast('没有可抽取的问题'); return; }
  _qaSelectedId = docs[Math.floor(Math.random() * docs.length)].id;
  _qaRevealed = false;
  _qaEditing = false;
  refreshQaView();
};

window.revealQaAnswer = function () { _qaRevealed = true; refreshQaView(); };
window.hideQaAnswer = function () { _qaRevealed = false; refreshQaView(); };

window.qaEditToggle = function (on) { _qaEditing = !!on; refreshQaView(); };
window.qaCancelEdit = function () { _qaEditing = false; refreshQaView(); };

window.qaSaveEdit = function (docId) {
  const val = document.getElementById('qa-edit-textarea')?.value;
  if (val === undefined || val === null) return;
  AppState.updateDocument(docId, { content: val });
  _qaEditing = false;
  showToast('已保存');
  refreshQaView();
};

window.deleteQaDoc = async function (docId) {
  const ok = await confirmAction('确定删除此文书？此操作不可撤销。');
  if (!ok) return;
  AppState.deleteDocument(docId);
  if (_qaSelectedId === docId) _qaSelectedId = null;
  _qaRevealed = false;
  _qaEditing = false;
  showToast('已删除');
  filterDocs();
};

window.addNewDocument = function () {
  Modal.show({
    title: '新建文书',
    body: `
      <div class="form-group"><label class="form-label">标题</label><input class="form-input" id="new-doc-title" placeholder="文书标题"></div>
      <div class="form-group"><label class="form-label">类别</label><input class="form-input" id="new-doc-cat" placeholder="e.g. 面试准备"></div>
      <div class="form-group"><label class="form-label">方向</label><input class="form-input" id="new-doc-dir" placeholder="e.g. General"></div>
      <div class="form-group"><label class="form-label">要求/备注</label><textarea class="form-textarea" id="new-doc-req" rows="2"></textarea></div>
    `,
    onSave: () => {
      const title = document.getElementById('new-doc-title').value.trim();
      if (!title) { alert('请输入标题'); return; }
      const doc = AppState.addDocument({
        title,
        category: document.getElementById('new-doc-cat').value.trim() || '其他',
        direction: document.getElementById('new-doc-dir').value.trim() || 'General',
        requirements: document.getElementById('new-doc-req').value.trim(),
        content: '',
        status: '草稿',
        versions: [],
      });
      _qaSelectedId = doc.id;
      _qaEditing = false;
      _qaRevealed = false;
      Modal.hide();
      showToast('已创建文书');
      Router.resolve();
    },
  });
};
