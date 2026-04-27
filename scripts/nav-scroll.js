(() => {
  const normalizePath = (path) => {
    const clean = String(path || '').replace(/^\//, '');
    return clean === '' ? 'index.html' : clean;
  };

  const scrollPageTop = (behavior = 'auto') => {
    window.scrollTo({ top: 0, left: 0, behavior });
  };

  const closeMobileHeader = () => {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.menu-toggle');
    const menuNavItem = document.querySelector('.menu-nav-item');
    const menuTrigger = document.querySelector('.menu-trigger');
    if (header) header.classList.remove('mobile-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (menuNavItem) menuNavItem.classList.remove('is-open');
    if (menuTrigger) {
      menuTrigger.setAttribute('aria-expanded', 'false');
      menuTrigger.classList.remove('active');
    }
  };

  const isBackForward = () => {
    const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    return !!nav && nav.type === 'back_forward';
  };

  const currentPath = () => normalizePath(window.location.pathname);

  const handlePlainPageLoad = () => {
    if (window.location.hash) return;
    if (isBackForward()) return;
    requestAnimationFrame(() => scrollPageTop('auto'));
  };

  window.addEventListener('pageshow', handlePlainPageLoad);

  document.addEventListener('DOMContentLoaded', () => {
    handlePlainPageLoad();

    const pageNavLinks = document.querySelectorAll('.site-header a[href], .mobile-bar a[href], .site-footer a[href]');
    pageNavLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const rawHref = link.getAttribute('href');
        if (!rawHref || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('https://')) return;
        if (rawHref === '#' || rawHref.startsWith('#')) return;

        const url = new URL(rawHref, window.location.href);
        if (url.origin !== window.location.origin) return;

        const targetPath = normalizePath(url.pathname);
        const samePath = targetPath === currentPath();

        if (!samePath) return;

        if (url.hash) return;

        event.preventDefault();
        closeMobileHeader();
        if (window.location.pathname !== url.pathname || window.location.search !== url.search || window.location.hash) {
          window.history.pushState({}, '', `${url.pathname}${url.search}`);
        }
        scrollPageTop('smooth');
      });
    });
  });
})();
