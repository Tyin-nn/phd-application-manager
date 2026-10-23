// === UUID Generator ===
function generateId() {
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

// === Date Formatting ===
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = parseLocalDate(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// Parse 'YYYY-MM-DD' as local date to avoid UTC timezone off-by-one
function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(dateStr));
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function daysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const d = parseLocalDate(dateStr);
  if (!d) return Infinity;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((d - now) / (1000 * 60 * 60 * 24));
}

// === Escape HTML ===
function escapeHtml(str) {
  if (str === undefined || str === null || str === '') return '';
  let s = String(str);
  s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  s = s.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  return s;
}

// === Debounce ===
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// === Tier Label ===
function tierLabel(tier) {
  const map = { '冲刺': '冲刺', '核心': '核心', '保底': '保底' };
  return map[tier] || tier || '—';
}

function tierClass(tier) {
  const map = { '冲刺': 'sprint', '核心': 'core', '保底': 'safe' };
  return map[tier] || '';
}

const COUNTRY_REGION = {
  'Denmark': '欧洲', 'Sweden': '欧洲', 'Norway': '欧洲', 'Finland': '欧洲',
  'Netherlands': '欧洲', 'Italy': '欧洲', 'France': '欧洲', 'United Kingdom': '欧洲',
  'UK': '欧洲', 'Germany': '欧洲', 'Switzerland': '欧洲', 'Austria': '欧洲',
  'Belgium': '欧洲', 'Spain': '欧洲', 'Portugal': '欧洲', 'Ireland': '欧洲',
  'Poland': '欧洲', 'Czech Republic': '欧洲', 'Czechia': '欧洲', 'Greece': '欧洲',
  'Hungary': '欧洲', 'Romania': '欧洲', 'Estonia': '欧洲', 'Latvia': '欧洲',
  'Lithuania': '欧洲', 'Iceland': '欧洲', 'Luxembourg': '欧洲', 'Slovenia': '欧洲',
  'Croatia': '欧洲', 'Bulgaria': '欧洲', 'Slovakia': '欧洲', 'Serbia': '欧洲',
  'Ukraine': '欧洲',
  'China': '亚洲', 'Japan': '亚洲', 'South Korea': '亚洲', 'Korea': '亚洲',
  'Singapore': '亚洲', 'Hong Kong': '亚洲', 'Taiwan': '亚洲', 'India': '亚洲',
  'Malaysia': '亚洲', 'Thailand': '亚洲', 'Vietnam': '亚洲', 'Indonesia': '亚洲',
  'Philippines': '亚洲', 'Pakistan': '亚洲', 'Bangladesh': '亚洲', 'Sri Lanka': '亚洲',
  'United Arab Emirates': '中东', 'UAE': '中东', 'Saudi Arabia': '中东',
  'Qatar': '中东', 'Israel': '中东', 'Turkey': '中东', 'Iran': '中东',
  'Iraq': '中东', 'Jordan': '中东', 'Lebanon': '中东', 'Kuwait': '中东',
  'Oman': '中东', 'Bahrain': '中东',
  'Australia': '大洋洲', 'New Zealand': '大洋洲',
  'United States': '北美洲', 'USA': '北美洲', 'US': '北美洲',
  'Canada': '北美洲', 'Mexico': '北美洲',
  'Brazil': '南美洲', 'Argentina': '南美洲', 'Chile': '南美洲',
  'South Africa': '非洲', 'Egypt': '非洲', 'Kenya': '非洲', 'Morocco': '非洲',
};

const REGION_ORDER = ['欧洲', '亚洲', '中东', '大洋洲', '北美洲', '南美洲', '非洲', '其他'];

function regionOf(country) {
  if (!country) return '其他';
  const key = String(country).trim();
  if (COUNTRY_REGION[key]) return COUNTRY_REGION[key];
  const lower = key.toLowerCase();
  const found = Object.keys(COUNTRY_REGION).find(k => k.toLowerCase() === lower);
  return found ? COUNTRY_REGION[found] : '其他';
}

function regionSortIndex(region) {
  const idx = REGION_ORDER.indexOf(region);
  return idx === -1 ? REGION_ORDER.length - 1 : idx;
}

// === Status Label ===
function statusLabel(status) {
  const map = {
    '未开始': '未开始', '进行中': '进行中', '已完成': '已完成', '不适用': '不适用',
  };
  return map[status] || status || '—';
}

function statusClass(status) {
  const map = {
    '未开始': 'not-started', '进行中': 'in-progress', '已完成': 'done', '不适用': 'na',
  };
  return map[status] || '';
}

// === Program Status ===
function programStatusLabel(s) {
  return s === 'paused' ? '暂不申请' : '申请中';
}

// === Toast ===
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// === Confirm Dialog ===
function confirmAction(msg) {
  return new Promise((resolve) => {
    if (confirm(msg)) { resolve(true); } else { resolve(false); }
  });
}
