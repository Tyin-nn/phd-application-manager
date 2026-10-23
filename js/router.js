// === Hash-based SPA Router ===
const Router = {
  routes: {},
  currentRoute: null,
  currentParams: {},

  register(path, handler) {
    this.routes[path] = handler;
  },

  navigate(path) {
    window.location.hash = path;
  },

  start() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  },

  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    // Find matching route with param support
    let handler = null;
    let params = {};

    // Exact match first
    if (this.routes[hash]) {
      handler = this.routes[hash];
    } else {
      // Param routes: /documents/:docId, /recommenders/:id
      const parts = hash.split('/');
      for (const [pattern, h] of Object.entries(this.routes)) {
        const patternParts = pattern.split('/');
        if (patternParts.length === parts.length) {
          const match = patternParts.every((p, i) => {
            if (p.startsWith(':')) {
              params[p.slice(1)] = parts[i];
              return true;
            }
            return p === parts[i];
          });
          if (match) {
            handler = h;
            break;
          }
        }
      }
    }

    if (handler) {
      this.currentRoute = hash;
      this.currentParams = params;
      handler(params);
    } else {
      // Default to dashboard
      this.navigate('/');
    }
  },

  getParams() {
    return this.currentParams;
  },
};
