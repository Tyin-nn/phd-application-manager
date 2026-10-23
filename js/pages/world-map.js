const CITY_COORDS = {
  'Aarhus': [56.1629, 10.2039],
  'Abu Dhabi': [24.4539, 54.3773],
  'Amsterdam': [52.3676, 4.9041],
  'Bergen': [60.3913, 5.3221],
  'Bologna': [44.4949, 11.3426],
  'Canberra': [-35.2809, 149.1300],
  'Copenhagen': [55.6761, 12.5683],
  'Espoo': [60.2055, 24.6559],
  'Gothenburg': [57.7089, 11.9746],
  'Groningen': [53.2194, 6.5665],
  'Hangzhou': [30.2741, 120.1551],
  'Helsinki': [60.1699, 24.9384],
  'Hasselt': [50.9307, 5.3325],
  'Leiden': [52.1601, 4.4970],
  'Lund': [55.7047, 13.1910],
  'Lyngby': [55.7704, 12.5038],
  'Marseille': [43.2965, 5.3698],
  'Nijmegen': [51.8126, 5.8372],
  'Oslo': [59.9139, 10.7522],
  'Paris': [48.8566, 2.3522],
  'Stockholm': [59.3293, 18.0686],
  'Turku': [60.4518, 22.2666],
  'Uppsala': [59.8586, 17.6389],
  'London': [51.5074, -0.1278],
  'Liverpool': [53.4084, -2.9916],
  'Zurich': [47.3769, 8.5417],
  'Geneva': [46.2044, 6.1432],
  'Heidelberg': [49.3988, 8.6724],
  'Garching': [48.2489, 11.6532],
  'Munich': [48.1351, 11.5820],
  'Trieste': [45.6495, 13.7768],
  'Barcelona': [41.3874, 2.1686],
  'Madrid': [40.4168, -3.7038],
};

const COUNTRY_COORDS = {
  'Denmark': [56.0, 10.0],
  'Sweden': [60.0, 15.0],
  'Norway': [61.0, 8.5],
  'Finland': [64.0, 26.0],
  'Netherlands': [52.5, 5.5],
  'Italy': [42.8, 12.5],
  'France': [46.2, 2.2],
  'China': [35.9, 104.2],
  'Australia': [-25.3, 133.8],
  'United Arab Emirates': [24.0, 54.0],
  'UAE': [24.0, 54.0],
  'United Kingdom': [55.3781, -3.4360],
  'UK': [55.3781, -3.4360],
  'Germany': [51.1657, 10.4515],
  'Switzerland': [46.8182, 8.2275],
  'Austria': [47.5162, 14.5501],
  'Belgium': [50.5039, 4.4699],
  'Spain': [40.4637, -3.7492],
  'Portugal': [39.3999, -8.2245],
  'Ireland': [53.1424, -7.6921],
  'Poland': [51.9194, 19.1451],
  'Czech Republic': [49.8175, 15.4730],
  'Czechia': [49.8175, 15.4730],
  'Greece': [39.0742, 21.8243],
  'Japan': [36.2048, 138.2529],
  'South Korea': [35.9078, 127.7669],
  'Korea': [35.9078, 127.7669],
  'Singapore': [1.3521, 103.8198],
  'India': [20.5937, 78.9629],
  'New Zealand': [-40.9006, 174.8860],
  'Saudi Arabia': [23.8859, 45.0792],
  'Qatar': [25.3548, 51.1839],
  'Israel': [31.0461, 34.8516],
  'Turkey': [38.9637, 35.2433],
  'Canada': [56.1304, -106.3468],
  'United States': [37.0902, -95.7129],
  'USA': [37.0902, -95.7129],
  'US': [37.0902, -95.7129],
  'Mexico': [23.6345, -102.5528],
  'Brazil': [-14.2350, -51.9253],
  'South Africa': [-30.5595, 22.9375],
  'Hong Kong': [22.3193, 114.1694],
  'Taiwan': [23.6978, 120.9605],
};

const COUNTRY_ISO2 = {
  'Denmark': 'DK',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Finland': 'FI',
  'Netherlands': 'NL',
  'Italy': 'IT',
  'France': 'FR',
  'China': 'CN',
  'Australia': 'AU',
  'United Arab Emirates': 'AE',
  'UAE': 'AE',
  'United Kingdom': 'GB',
  'UK': 'GB',
  'Germany': 'DE',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Belgium': 'BE',
  'Spain': 'ES',
  'Portugal': 'PT',
  'Ireland': 'IE',
  'Poland': 'PL',
  'Czech Republic': 'CZ',
  'Czechia': 'CZ',
  'Greece': 'GR',
  'Japan': 'JP',
  'South Korea': 'KR',
  'Korea': 'KR',
  'Singapore': 'SG',
  'India': 'IN',
  'New Zealand': 'NZ',
  'Saudi Arabia': 'SA',
  'Qatar': 'QA',
  'Israel': 'IL',
  'Turkey': 'TR',
  'Canada': 'CA',
  'United States': 'US',
  'USA': 'US',
  'US': 'US',
  'Mexico': 'MX',
  'Brazil': 'BR',
  'South Africa': 'ZA',
  'Hong Kong': 'HK',
  'Taiwan': 'TW',
};

const MAP_TIER_COLORS = {
  '冲刺': '#dc2626',
  '核心': '#d97706',
  '保底': '#16a34a',
  '': '#9ca3af',
};

const TIER_PRIORITY = { '冲刺': 0, '核心': 1, '保底': 2 };

const WorldMapState = {
  map: null,
  markers: [],
  unlocated: [],
  tour: { active: false, steps: [], index: -1 },
  selectedMarker: null,
  resizeHandler: null,
};

function normalizeCityName(location) {
  return String(location || '').replace(/\s*\([^)]*\)\s*/g, '').trim();
}

function highestTier(programs) {
  let best = '';
  programs.forEach(p => {
    if (!p.tier) return;
    const current = TIER_PRIORITY[best];
    const candidate = TIER_PRIORITY[p.tier];
    if (best === '' || (candidate !== undefined && (current === undefined || candidate < current))) {
      best = p.tier;
    }
  });
  return best;
}

function markerColor(group) {
  return MAP_TIER_COLORS[highestTier(group.programs)] || MAP_TIER_COLORS[''];
}

function groupProgramsByCity(programs) {
  const groups = new Map();
  const unlocated = [];

  programs.forEach(p => {
    const city = normalizeCityName(p.location) || p.country || '未定位';
    const coords = CITY_COORDS[city] || COUNTRY_COORDS[p.country];
    if (!coords) {
      unlocated.push(p);
      return;
    }
    const key = city + '|' + p.country;
    if (!groups.has(key)) {
      groups.set(key, { key, city, country: p.country, coords, programs: [] });
    }
    groups.get(key).programs.push(p);
  });

  const list = [...groups.values()].sort((a, b) => {
    const ra = regionSortIndex(regionOf(a.country));
    const rb = regionSortIndex(regionOf(b.country));
    if (ra !== rb) return ra - rb;
    if (a.country !== b.country) return a.country.localeCompare(b.country);
    return a.city.localeCompare(b.city);
  });

  return { groups: list, unlocated };
}

function getAvailableRegions() {
  return REGION_ORDER.filter(r => AppState.programs.some(p => regionOf(p.country) === r));
}

function getTourRegions() {
  return getAvailableRegions().filter(r =>
    r !== '其他' && AppState.programs.some(p => regionOf(p.country) === r && COUNTRY_ISO2[p.country])
  );
}

function isoCodesFor(programs) {
  return [...new Set(programs.map(p => COUNTRY_ISO2[p.country]).filter(Boolean))];
}

function nearestDeadlineProgram(programs) {
  const withDeadline = programs.filter(p => p.deadline);
  if (withDeadline.length === 0) return null;
  const future = withDeadline.filter(p => daysUntil(p.deadline) >= 0);
  const pool = future.length > 0 ? future : withDeadline;
  return pool.slice().sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))[0];
}

function deadlineRelative(dateStr) {
  const days = daysUntil(dateStr);
  if (!isFinite(days)) return '';
  if (days > 0) return `${days} 天后`;
  if (days === 0) return '今天';
  return `已过 ${Math.abs(days)} 天`;
}

function countTiers(programs) {
  const counts = { '冲刺': 0, '核心': 0, '保底': 0, '': 0 };
  programs.forEach(p => {
    const key = p.tier || '';
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function sortProgramsByDeadline(programs) {
  return programs.slice().sort((a, b) => {
    const da = a.deadline ? daysUntil(a.deadline) : Infinity;
    const db = b.deadline ? daysUntil(b.deadline) : Infinity;
    const fa = da >= 0;
    const fb = db >= 0;
    if (fa !== fb) return fa ? -1 : 1;
    if (da !== db) return da - db;
    return a.institution.localeCompare(b.institution);
  });
}

function renderMapTierTag(tier) {
  if (!tier) return '<span class="tag">未分类</span>';
  return `<span class="tag tag-tier-${tierClass(tier)}">${tierLabel(tier)}</span>`;
}

function renderMapProgramRow(p) {
  const days = p.deadline ? daysUntil(p.deadline) : Infinity;
  const deadline = p.deadline
    ? `<span class="map-deadline${days >= 0 && days <= 14 ? ' urgent' : ''}">${formatDate(p.deadline)}${isFinite(days) ? ` · ${deadlineRelative(p.deadline)}` : ''}</span>`
    : '';
  return `<div class="map-program-item">
    <div class="map-program-main">
      <div class="map-program-name">${escapeHtml(p.institution)}</div>
      <div class="map-program-meta">
        ${renderMapTierTag(p.tier)}
        <span class="app-status app-status-${appStatusClass(p.appStatus)}">${appStatusLabel(p.appStatus)}</span>
        ${deadline}
      </div>
    </div>
    <div class="map-program-actions">
      <button class="btn btn-sm btn-secondary" onclick="Router.navigate('/materials');AppState._focusProgram='${p.id}';">材料</button>
      <button class="btn btn-sm btn-ghost" onclick="openProgramEditModal('${p.id}')">编辑</button>
    </div>
  </div>`;
}

function renderMapCityGroup(group) {
  return `<div class="map-city-group">
    <div class="map-city-header">
      <div><strong>${escapeHtml(group.city)}</strong><span class="map-city-country">${escapeHtml(group.country)}</span></div>
      <span class="map-city-count">${group.programs.length} 个项目</span>
    </div>
    ${sortProgramsByDeadline(group.programs).map(renderMapProgramRow).join('')}
  </div>`;
}

function renderUnlocated(programs) {
  if (programs.length === 0) return '';
  return `<div class="map-unlocated">
    <div class="map-section-title">未定位项目</div>
    ${sortProgramsByDeadline(programs).map(renderMapProgramRow).join('')}
  </div>`;
}

function renderMapOverviewPanel() {
  const panel = document.getElementById('map-panel');
  if (!panel) return;
  const programs = AppState.programs;
  const { groups, unlocated } = groupProgramsByCity(programs);
  const regions = getAvailableRegions();
  const nearest = nearestDeadlineProgram(programs);
  const tiers = countTiers(programs);

  let html = `<div class="map-panel-header">
    <div class="map-panel-eyebrow">WORLD OVERVIEW</div>
    <h2>全部项目</h2>
    <p>${programs.length} 个项目 · ${groups.length} 个城市 · ${regions.length} 个地区</p>
  </div>`;

  html += `<div class="map-stat-grid">
    <div class="map-stat">
      <span>最近截止</span>
      <strong>${nearest ? formatDate(nearest.deadline) : '—'}</strong>
      <small>${nearest ? escapeHtml(nearest.institution) : '暂无截止日'}</small>
    </div>
    <div class="map-stat">
      <span>档次分布</span>
      <strong>${tiers['冲刺']} / ${tiers['核心']} / ${tiers['保底']}</strong>
      <small>冲刺 / 核心 / 保底${tiers[''] ? ` · 未分类 ${tiers['']}` : ''}</small>
    </div>
  </div>`;

  html += `<div class="map-section-title">按地区浏览</div><div class="map-region-list">`;
  regions.forEach(r => {
    const regionPrograms = programs.filter(p => regionOf(p.country) === r);
    const cityCount = new Set(regionPrograms.map(p => normalizeCityName(p.location) || p.country)).size;
    html += `<button class="map-region-row" data-region="${escapeHtml(r)}" onclick="focusWorldMapRegion(this.dataset.region)">
      <span class="map-region-name">${escapeHtml(r)}</span>
      <span class="map-region-meta">${regionPrograms.length} 个项目 · ${cityCount} 个城市</span>
      <span class="map-region-arrow">→</span>
    </button>`;
  });
  html += `</div>`;

  html += renderUnlocated(unlocated);
  panel.innerHTML = html;
}

function renderMapRegionPanel(region) {
  const panel = document.getElementById('map-panel');
  if (!panel) return;
  const programs = AppState.programs.filter(p => regionOf(p.country) === region);
  const { groups, unlocated } = groupProgramsByCity(programs);
  const nearest = nearestDeadlineProgram(programs);
  const tiers = countTiers(programs);

  let html = `<div class="map-panel-header">
    <div class="map-panel-eyebrow">REGION</div>
    <h2>${escapeHtml(region)}</h2>
    <p>${programs.length} 个项目 · ${groups.length} 个城市</p>
  </div>`;

  html += `<div class="map-stat-grid">
    <div class="map-stat">
      <span>最近截止</span>
      <strong>${nearest ? formatDate(nearest.deadline) : '—'}</strong>
      <small>${nearest ? escapeHtml(nearest.institution) : '暂无截止日'}</small>
    </div>
    <div class="map-stat">
      <span>档次分布</span>
      <strong>${tiers['冲刺']} / ${tiers['核心']} / ${tiers['保底']}</strong>
      <small>冲刺 / 核心 / 保底${tiers[''] ? ` · 未分类 ${tiers['']}` : ''}</small>
    </div>
  </div>`;

  html += `<div class="map-section-title">城市与项目</div>`;
  html += groups.map(renderMapCityGroup).join('');
  html += renderUnlocated(unlocated);
  panel.innerHTML = html;
}

function renderMapCityPanel(marker) {
  const panel = document.getElementById('map-panel');
  if (!panel) return;
  const region = regionOf(marker.country);
  const nearest = nearestDeadlineProgram(marker.programs);

  let html = `<div class="map-panel-header">
    <div class="map-panel-eyebrow">CITY</div>
    <h2>${escapeHtml(marker.city)}</h2>
    <p>${escapeHtml(marker.country)} · ${marker.programs.length} 个项目</p>
  </div>`;

  if (nearest) {
    html += `<div class="map-stat-grid">
      <div class="map-stat">
        <span>最近截止</span>
        <strong>${formatDate(nearest.deadline)}</strong>
        <small>${escapeHtml(nearest.institution)}</small>
      </div>
      <div class="map-stat">
        <span>地区</span>
        <strong>${escapeHtml(region)}</strong>
        <small>点击下方返回地区列表</small>
      </div>
    </div>`;
  }

  html += `<div class="map-back-row">
    <button class="btn btn-sm btn-ghost" data-region="${escapeHtml(region)}" onclick="focusWorldMapRegion(this.dataset.region)">← 返回${escapeHtml(region)}</button>
  </div>`;
  html += sortProgramsByDeadline(marker.programs).map(renderMapProgramRow).join('');
  panel.innerHTML = html;
}

function setActiveRegionChip(region) {
  document.querySelectorAll('.map-region-chip').forEach(btn => {
    const active = btn.dataset.region === region;
    btn.classList.toggle('btn-primary', active);
    btn.classList.toggle('btn-secondary', !active);
  });
}

function updateTourControls() {
  const progress = document.getElementById('map-tour-progress');
  const start = document.getElementById('map-tour-start');
  const prev = document.getElementById('map-tour-prev');
  const next = document.getElementById('map-tour-next');
  const end = document.getElementById('map-tour-end');
  if (!progress || !start || !prev || !next || !end) return;

  const tour = WorldMapState.tour;
  if (tour.active && tour.steps.length > 0) {
    progress.textContent = `第 ${tour.index + 1} / ${tour.steps.length} 站 · ${tour.steps[tour.index]}`;
    start.textContent = '重新开始';
    prev.disabled = tour.index === 0;
    next.disabled = false;
    next.textContent = tour.index === tour.steps.length - 1 ? '完成' : '下一站';
    end.disabled = false;
  } else {
    progress.textContent = '全部地区';
    start.textContent = '开始导览';
    prev.disabled = true;
    next.disabled = true;
    next.textContent = '下一站';
    end.disabled = true;
  }
}

function destroyWorldMap() {
  if (WorldMapState.resizeHandler) {
    window.removeEventListener('resize', WorldMapState.resizeHandler);
    WorldMapState.resizeHandler = null;
  }
  if (WorldMapState.map) {
    try { WorldMapState.map.destroy(); } catch (e) {}
    WorldMapState.map = null;
  }
}

function initWorldMap() {
  const container = document.getElementById('world-map');
  if (!container) return;
  if (typeof jsVectorMap === 'undefined') {
    container.innerHTML = '<div class="map-empty">地图组件加载失败</div>';
    return;
  }

  const { groups, unlocated } = groupProgramsByCity(AppState.programs);
  WorldMapState.unlocated = unlocated;
  WorldMapState.markers = groups.map(g => ({
    ...g,
    name: g.city,
    style: { initial: { fill: markerColor(g) } },
  }));

  if (WorldMapState.markers.length === 0) {
    container.innerHTML = '<div class="map-empty">暂无可定位的项目</div>';
    return;
  }

  WorldMapState.map = new jsVectorMap({
    selector: '#world-map',
    map: 'world',
    backgroundColor: 'transparent',
    zoomButtons: true,
    zoomOnScroll: true,
    zoomMax: 8,
    zoomMin: 1,
    draggable: true,
    showTooltip: true,
    markersSelectable: true,
    markersSelectableOne: true,
    markers: WorldMapState.markers.map(m => ({
      name: m.name,
      coords: m.coords,
      style: m.style,
    })),
    markerStyle: {
      initial: { r: 5, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 1.5 },
      hover: { r: 7 },
      selected: { r: 8, stroke: '#111827', strokeWidth: 2 },
      selectedHover: { r: 8 },
    },
    regionStyle: {
      initial: { fill: '#e5e7eb', stroke: '#ffffff', strokeWidth: 0.5 },
      hover: { fill: '#dbeafe' },
      selected: { fill: '#bfdbfe' },
    },
    onMarkerClick: (event, index) => selectWorldMapMarker(index),
    onMarkerTooltipShow: (event, tooltip, index) => {
      const marker = WorldMapState.markers[index];
      if (!marker) return;
      const nearest = nearestDeadlineProgram(marker.programs);
      const nearestText = nearest
        ? `${formatDate(nearest.deadline)}（${deadlineRelative(nearest.deadline)}）`
        : '暂无截止日';
      tooltip.text(
        `<strong>${escapeHtml(marker.city)}</strong> · ${escapeHtml(marker.country)}<br>${marker.programs.length} 个项目 · 最近 ${escapeHtml(nearestText)}`,
        true
      );
    },
  });

  WorldMapState.resizeHandler = () => {
    if (WorldMapState.map) WorldMapState.map.updateSize();
  };
  window.addEventListener('resize', WorldMapState.resizeHandler);
}

function focusWorldMapRegion(region, fromTour) {
  if (!WorldMapState.map) return;
  if (!fromTour) {
    WorldMapState.tour.active = false;
    WorldMapState.tour.index = -1;
  }
  WorldMapState.selectedMarker = null;

  const programs = region === '全部'
    ? AppState.programs
    : AppState.programs.filter(p => regionOf(p.country) === region);
  let codes = isoCodesFor(programs);
  if (codes.length === 0) codes = isoCodesFor(AppState.programs);
  if (codes.length > 0) {
    WorldMapState.map.setFocus({ regions: codes, animate: true });
  }

  WorldMapState.map.clearSelectedMarkers();
  const indexes = WorldMapState.markers
    .map((m, i) => (region === '全部' || regionOf(m.country) === region) ? i : -1)
    .filter(i => i >= 0);
  if (region !== '全部' && indexes.length > 0) WorldMapState.map.setSelectedMarkers(indexes);

  setActiveRegionChip(region);
  if (region === '全部') renderMapOverviewPanel();
  else renderMapRegionPanel(region);
  updateTourControls();
}

function selectWorldMapMarker(index) {
  const marker = WorldMapState.markers[index];
  if (!marker || !WorldMapState.map) return;
  WorldMapState.tour.active = false;
  WorldMapState.tour.index = -1;
  WorldMapState.selectedMarker = index;
  WorldMapState.map.clearSelectedMarkers();
  WorldMapState.map.setSelectedMarkers([index]);
  WorldMapState.map.setFocus({ coords: marker.coords, scale: 4, animate: true });
  setActiveRegionChip(regionOf(marker.country));
  renderMapCityPanel(marker);
  updateTourControls();
}

function startWorldMapTour() {
  const steps = getTourRegions();
  if (steps.length === 0) {
    showToast('暂无可导览的地区');
    return;
  }
  WorldMapState.tour = { active: true, steps, index: 0 };
  focusWorldMapRegion(steps[0], true);
  updateTourControls();
}

function worldMapTourStep(delta) {
  if (!WorldMapState.map) return;
  if (!WorldMapState.tour.active) {
    startWorldMapTour();
    return;
  }
  const tour = WorldMapState.tour;
  const next = tour.index + delta;
  if (next < 0) return;
  if (next >= tour.steps.length) {
    endWorldMapTour();
    return;
  }
  tour.index = next;
  focusWorldMapRegion(tour.steps[next], true);
  updateTourControls();
}

function endWorldMapTour() {
  WorldMapState.tour = { active: false, steps: [], index: -1 };
  focusWorldMapRegion('全部');
  updateTourControls();
}

function renderWorldMapPage() {
  destroyWorldMap();
  WorldMapState.tour = { active: false, steps: [], index: -1 };
  WorldMapState.selectedMarker = null;

  const regions = getAvailableRegions();

  let html = '';
  html += '<div class="map-toolbar">';
  html += '<div class="map-region-chips">';
  html += `<button class="btn btn-sm map-region-chip btn-secondary" data-region="全部" onclick="focusWorldMapRegion(this.dataset.region)">全部</button>`;
  regions.forEach(r => {
    html += `<button class="btn btn-sm map-region-chip btn-secondary" data-region="${escapeHtml(r)}" onclick="focusWorldMapRegion(this.dataset.region)">${escapeHtml(r)}</button>`;
  });
  html += '</div>';
  html += '<div class="map-tour-controls">';
  html += '<span class="map-tour-progress" id="map-tour-progress">全部地区</span>';
  html += '<button class="btn btn-sm btn-primary" id="map-tour-start" onclick="startWorldMapTour()">开始导览</button>';
  html += '<button class="btn btn-sm btn-secondary" id="map-tour-prev" onclick="worldMapTourStep(-1)" disabled>上一站</button>';
  html += '<button class="btn btn-sm btn-secondary" id="map-tour-next" onclick="worldMapTourStep(1)" disabled>下一站</button>';
  html += '<button class="btn btn-sm btn-ghost" id="map-tour-end" onclick="endWorldMapTour()" disabled>结束</button>';
  html += '</div>';
  html += '</div>';

  html += '<div class="map-layout">';
  html += '<div class="map-main">';
  html += '<div id="world-map" class="world-map"></div>';
  html += '<div class="map-legend">';
  Object.keys(MAP_TIER_COLORS).forEach(tier => {
    html += `<span class="map-legend-item"><span class="map-legend-dot" style="background:${MAP_TIER_COLORS[tier]}"></span>${tier || '未分类'}</span>`;
  });
  html += '<span class="map-hint">滚轮缩放 · 拖动平移 · 点击圆点查看城市</span>';
  html += '</div>';
  html += '</div>';
  html += '<aside class="map-side-panel" id="map-panel"></aside>';
  html += '</div>';

  renderPage('世界地图导览', '按地区浏览全部 PhD 项目，点击地图圆点查看城市与项目详情', html);
  setActiveRegionChip('全部');
  renderMapOverviewPanel();
  updateTourControls();
  requestAnimationFrame(initWorldMap);
}

window.focusWorldMapRegion = focusWorldMapRegion;
window.selectWorldMapMarker = selectWorldMapMarker;
window.startWorldMapTour = startWorldMapTour;
window.worldMapTourStep = worldMapTourStep;
window.endWorldMapTour = endWorldMapTour;

window.addEventListener('hashchange', () => {
  const path = window.location.hash.slice(1) || '/';
  if (path !== '/map') destroyWorldMap();
});
