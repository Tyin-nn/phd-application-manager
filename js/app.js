// === App Bootstrap ===
(function () {
  // Initialize state
  AppState.init();

  // Register routes
  Router.register('/', renderDashboard);
  Router.register('/programs', renderProgramList);
  Router.register('/map', renderWorldMapPage);
  Router.register('/materials', renderMaterials);
  Router.register('/letter-overview', renderLetterOverview);
  Router.register('/documents', renderDocLibrary);
  Router.register('/documents/:docId', (params) => renderDocEditor(params.docId));
  Router.register('/recommenders', renderRecommenderList);
  Router.register('/recommenders/:id', (params) => renderRecommenderDetail(params.id));
  Router.register('/letter-assign', renderLetterAssign);

  // Render navbar
  renderNavbar();

  // Start router
  Router.start();

  // Update navbar active on route change
  window.addEventListener('hashchange', updateNavbarActive);

  // Global: focus program for materials page
  AppState._focusProgram = null;
})();

// Wrapper to render page content
function renderPage(title, subtitle, content) {
  const main = document.getElementById('main-content');
  let html = '<div class="page-header">';
  html += `<h1>${escapeHtml(title)}</h1>`;
  if (subtitle) html += `<p>${escapeHtml(subtitle)}</p>`;
  html += '</div>';
  html += content;
  main.innerHTML = html;
}
