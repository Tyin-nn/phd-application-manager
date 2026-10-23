// === Data Backup: Export / Import ===
function exportBackup() {
  const data = AppState.exportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  a.href = url;
  a.download = `phd-backup-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('已导出备份文件');
}

function importBackupFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    let data;
    try {
      data = JSON.parse(reader.result);
    } catch (e) {
      alert('文件解析失败：不是有效的 JSON 备份文件');
      return;
    }
    const progCount = Array.isArray(data.programs) ? data.programs.length : 0;
    Modal.show({
      title: '导入备份',
      body: `
        <p>将导入 <strong>${progCount}</strong> 个申请项目、<strong>${(data.documents || []).length}</strong> 篇文书。</p>
        <p class="text-danger" style="font-size:0.85rem;">⚠ 此操作会覆盖当前所有数据，且不可撤销。建议先导出当前数据作为备份。</p>
      `,
      saveLabel: '确认导入',
      onSave: () => {
        try {
          AppState.importData(data);
          Modal.hide();
          showToast('导入成功');
          renderNavbar();
          Router.resolve();
        } catch (e) {
          alert('导入失败：' + e.message);
        }
      },
    });
  };
  reader.readAsText(file);
}
