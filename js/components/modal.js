// === Modal Component ===
const Modal = {
  _resolve: null,

  show(opts) {
    const { title, body, footer, onSave, saveLabel = '保存', size = '' } = opts;
    const container = document.getElementById('modal-container');

    let html = '<div class="modal-overlay" id="modal-overlay">';
    html += `<div class="modal" style="${size === 'large' ? 'max-width:720px;' : ''}">`;
    html += '<div class="modal-header">';
    html += `<h3>${escapeHtml(title || '')}</h3>`;
    html += '<button class="modal-close" onclick="Modal.hide()">&times;</button>';
    html += '</div>';
    html += `<div class="modal-body">${body}</div>`;
    if (onSave || footer) {
      html += '<div class="modal-footer">';
      html += footer || `
        <button class="btn btn-secondary" onclick="Modal.hide()">取消</button>
        <button class="btn btn-primary" id="modal-save-btn">${escapeHtml(saveLabel)}</button>
      `;
      html += '</div>';
    }
    html += '</div></div>';

    container.innerHTML = html;

    // Close on overlay click
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') this.hide();
    });

    // Bind save
    const saveBtn = document.getElementById('modal-save-btn');
    if (saveBtn && onSave) {
      saveBtn.addEventListener('click', () => onSave());
    }

    // ESC to close
    this._escHandler = (e) => { if (e.key === 'Escape') this.hide(); };
    document.addEventListener('keydown', this._escHandler);
  },

  hide() {
    document.getElementById('modal-container').innerHTML = '';
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
    }
  },
};
