// === Progress Bar Component ===
function renderProgressBar(percentage, opts = {}) {
  const { showLabel = true, height = 8, color = '' } = opts;
  const style = color ? `background:${color};` : '';
  let html = '';
  if (showLabel) {
    html += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">`;
    html += `<span style="font-size:0.78rem;color:var(--gray-500);">完成进度</span>`;
    html += `<span style="font-size:0.85rem;font-weight:700;color:${percentage === 100 ? 'var(--success)' : 'var(--gray-700)'};">${percentage}%</span>`;
    html += `</div>`;
  }
  html += `<div class="progress-bar" style="height:${height}px;">`;
  html += `<div class="progress-fill" style="width:${percentage}%;${style}"></div>`;
  html += `</div>`;
  return html;
}
