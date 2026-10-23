// === Page 7: Recommender List (推荐人列表) ===
function renderRecommenderList() {
  let html = '';

  html += `<div class="flex-between mb-3">`;
  html += `<span class="text-muted">共 ${AppState.recommenders.length} 位推荐人</span>`;
  html += `<button class="btn btn-primary btn-sm" onclick="addRecommender()">+ 添加推荐人</button>`;
  html += '</div>';

  if (AppState.recommenders.length === 0) {
    html += '<div class="empty-state"><div class="empty-icon">👤</div><p>暂无推荐人，点击上方按钮添加</p></div>';
  } else {
    html += '<div class="table-wrap"><table>';
    html += '<thead><tr><th>姓名</th><th>职称</th><th>机构</th><th>邮箱</th><th>分配项目数</th><th>操作</th></tr></thead>';
    html += '<tbody>';
    AppState.recommenders.forEach(r => {
      const count = (r.assignedProgramIds || []).length;
      html += '<tr>';
      html += `<td><a href="#/recommenders/${r.id}" style="font-weight:600;">${escapeHtml(r.name || '(未填写)')}</a></td>`;
      html += `<td>${escapeHtml(r.title || '—')}</td>`;
      html += `<td>${escapeHtml(r.institution || '—')}</td>`;
      html += `<td>${escapeHtml(r.email || '—')}</td>`;
      html += `<td><span class="letter-count">${count}</span></td>`;
      html += `<td>`;
      html += `<button class="btn btn-sm btn-ghost" onclick="Router.navigate('/recommenders/${r.id}')">编辑</button>`;
      html += `<button class="btn btn-sm btn-ghost text-danger" onclick="deleteRecommenderConfirm('${r.id}')">删除</button>`;
      html += `</td>`;
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  }

  renderPage('推荐人列表', '管理推荐人信息', html);
}

window.addRecommender = function () {
  AppState.addRecommender({ name: '', title: '', institution: '', email: '', phone: '', notes: '', assignedProgramIds: [] });
  showToast('已添加推荐人');
  Router.resolve();
};

window.deleteRecommenderConfirm = async function (id) {
  const rec = AppState.getRecommender(id);
  const assigned = rec ? (rec.assignedProgramIds || []).length : 0;
  const msg = assigned > 0
    ? `确定删除推荐人「${rec.name || '(未命名)'}」？其已被分配到 ${assigned} 个项目，删除后这些分配将一并移除。`
    : '确定删除此推荐人？';
  const ok = await confirmAction(msg);
  if (ok) {
    AppState.deleteRecommender(id);
    showToast('已删除');
    Router.resolve();
  }
};
