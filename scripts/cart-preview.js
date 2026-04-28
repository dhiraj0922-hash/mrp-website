(function () {
  const CART_KEY = 'mrp-cart';
  const ORDER_URL = 'https://myrotiplace.bycalibre.ca/';
  // Cart is preview-only until Order My Roti provides API/deep-link cart support.

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && Array.isArray(parsed.items) ? parsed : { items: [] };
    } catch (error) {
      return { items: [] };
    }
  }

  function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    document.dispatchEvent(new CustomEvent('mrp-cart-updated', { detail: cart }));
  }

  function money(value) {
    return `$${Number(value || 0).toFixed(2)}`;
  }

  function itemUnitPrice(item) {
    if (typeof item.price === 'number') return Number(item.price);
    if (typeof item.totalPrice === 'number') return Number(item.totalPrice);
    return Number(item.price || item.totalPrice || 0);
  }

  function itemLineSubtotal(item) {
    const qty = Number(item.quantity || 1);
    return itemUnitPrice(item) * qty;
  }

  function mergeMenuItem(cart, payload) {
    const existing = cart.items.find((item) => item.id === payload.id && item.type === payload.type);
    if (existing) {
      existing.quantity = Number(existing.quantity || 1) + 1;
      existing.price = Number(payload.price || existing.price || 0);
      return;
    }
    cart.items.push({
      id: payload.id,
      type: payload.type,
      name: payload.name,
      price: Number(payload.price || 0),
      quantity: 1
    });
  }

  function removeCartItem(id) {
    const cart = readCart();
    cart.items = cart.items.filter((item) => item.id !== id);
    cart.updatedAt = new Date().toISOString();
    writeCart(cart);
    return cart;
  }

  function clearCart() {
    const cart = { items: [], updatedAt: new Date().toISOString() };
    writeCart(cart);
    return cart;
  }

  function updateCartItemQuantity(id, delta) {
    const cart = readCart();
    const item = cart.items.find((entry) => entry.id === id);
    if (!item) return cart;
    item.quantity = Math.max(0, Number(item.quantity || 1) + delta);
    cart.items = cart.items.filter((entry) => Number(entry.quantity || 0) > 0);
    cart.updatedAt = new Date().toISOString();
    writeCart(cart);
    return cart;
  }

  function addMenuItem(payload) {
    const cart = readCart();
    mergeMenuItem(cart, payload);
    cart.updatedAt = new Date().toISOString();
    writeCart(cart);
    return cart;
  }

  function cartCount(cart) {
    return (cart.items || []).reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  }

  function cartSubtotal(cart) {
    return (cart.items || []).reduce((sum, item) => sum + itemLineSubtotal(item), 0);
  }

  function buildPreviewParam(cart) {
    try {
      return encodeURIComponent(JSON.stringify({
        items: (cart.items || []).map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity || 1,
          price: itemUnitPrice(item)
        }))
      }));
    } catch (error) {
      return '';
    }
  }

  function injectUi() {
    if (document.querySelector('[data-cart-launcher]')) return;
    const style = document.createElement('style');
    style.textContent = `
      .mrp-cart-launcher {
        display: inline-flex;
        align-items: center;
        gap: .65rem;
        border: none;
        border-radius: 999px;
        padding: .72rem .95rem;
        background: #1F1A15;
        color: #F6EFE2;
        box-shadow: 0 10px 24px -12px rgba(31, 26, 21, 0.38);
        font: 700 .88rem var(--f-body, Inter, sans-serif);
        white-space: nowrap;
      }
      .mrp-cart-launcher-count {
        min-width: 1.5rem;
        height: 1.5rem;
        border-radius: 999px;
        background: rgba(255,255,255,.14);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: .78rem;
      }
      .mrp-cart-launcher svg {
        width: 16px;
        height: 16px;
      }
      .nav-cta .mrp-cart-launcher {
        order: -1;
      }
      .mrp-cart-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 10, 6, 0.34);
        opacity: 0;
        pointer-events: none;
        transition: opacity .2s ease;
        z-index: 150;
      }
      .mrp-cart-overlay.is-open {
        opacity: 1;
        pointer-events: auto;
      }
      .mrp-cart-drawer {
        position: fixed;
        top: 0;
        right: 0;
        width: min(420px, 100vw);
        height: 100vh;
        background: #F6EFE2;
        color: #1F1A15;
        box-shadow: -20px 0 60px -24px rgba(31, 26, 21, 0.38);
        transform: translateX(100%);
        transition: transform .24s ease;
        z-index: 151;
        display: grid;
        grid-template-rows: auto 1fr auto;
      }
      .mrp-cart-drawer.is-open { transform: translateX(0); }
      .mrp-cart-head,
      .mrp-cart-foot {
        padding: 1.15rem 1.15rem 1rem;
        border-bottom: 1px solid rgba(31,26,21,.08);
      }
      .mrp-cart-foot {
        border-top: 1px solid rgba(31,26,21,.08);
        border-bottom: 0;
        display: grid;
        gap: .8rem;
        background: rgba(237, 227, 206, 0.42);
      }
      .mrp-cart-headline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .mrp-cart-headline-copy {
        display: grid;
        gap: .2rem;
      }
      .mrp-cart-headline h3 {
        margin: 0;
        font: 600 1.35rem var(--f-display, Fraunces, serif);
      }
      .mrp-cart-headline p {
        margin: 0;
        color: #6B5F52;
        font-size: .82rem;
      }
      .mrp-cart-close {
        border: none;
        background: transparent;
        color: #1F1A15;
        font-size: 1.4rem;
        line-height: 1;
      }
      .mrp-cart-lines {
        overflow: auto;
        padding: .75rem 1.15rem 1rem;
        display: grid;
        gap: .75rem;
        align-content: start;
      }
      .mrp-cart-empty {
        padding: 1rem 0;
        color: #6B5F52;
      }
      .mrp-cart-line {
        background: #fff;
        border: 1px solid rgba(31,26,21,.08);
        border-radius: 18px;
        padding: .95rem 1rem;
        display: grid;
        gap: .45rem;
      }
      .mrp-cart-line-top,
      .mrp-cart-line-bottom,
      .mrp-cart-subtotal {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .mrp-cart-line-bottom {
        align-items: flex-end;
      }
      .mrp-cart-line-name {
        font-weight: 700;
      }
      .mrp-cart-line-meta,
      .mrp-cart-note {
        color: #6B5F52;
        font-size: .86rem;
      }
      .mrp-cart-line-actions {
        display: flex;
        align-items: center;
        gap: .8rem;
      }
      .mrp-cart-qty {
        display: inline-flex;
        align-items: center;
        gap: .35rem;
        padding: .2rem;
        border: 1px solid rgba(31,26,21,.08);
        border-radius: 999px;
        background: rgba(237, 227, 206, 0.5);
      }
      .mrp-cart-qty button {
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 999px;
        background: #fff;
        color: #1F1A15;
        font-weight: 800;
      }
      .mrp-cart-qty span {
        min-width: 1.5rem;
        text-align: center;
        font-weight: 700;
        font-size: .84rem;
      }
      .mrp-cart-remove {
        border: none;
        background: transparent;
        color: #9E2B1F;
        font-weight: 700;
        padding: 0;
      }
      .mrp-cart-head-actions {
        display: inline-flex;
        align-items: center;
        gap: .8rem;
      }
      .mrp-cart-clear {
        border: none;
        background: transparent;
        color: #9E2B1F;
        font-weight: 700;
        padding: 0;
      }
      .mrp-cart-checkout {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: .55rem;
        border: none;
        border-radius: 999px;
        padding: .95rem 1.15rem;
        background: #9E2B1F;
        color: #F6EFE2;
        font: 700 .95rem var(--f-body, Inter, sans-serif);
        text-decoration: none;
      }
      .mrp-cart-toast {
        position: fixed;
        left: 50%;
        bottom: 24px;
        transform: translateX(-50%) translateY(12px);
        z-index: 152;
        background: #1F1A15;
        color: #F6EFE2;
        padding: .72rem .95rem;
        border-radius: 999px;
        box-shadow: 0 12px 28px -14px rgba(0,0,0,.48);
        opacity: 0;
        pointer-events: none;
        transition: opacity .2s ease, transform .2s ease;
        font: 700 .84rem var(--f-body, Inter, sans-serif);
      }
      .mrp-cart-toast.is-visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      @media (max-width: 720px) {
        .nav-cta .mrp-cart-launcher {
          padding: .62rem;
          gap: .35rem;
        }
        .nav-cta .mrp-cart-launcher > span:first-of-type {
          display: none;
        }
        .nav-cta .mrp-cart-launcher-count {
          min-width: 1.35rem;
          height: 1.35rem;
          font-size: .72rem;
        }
        .mrp-cart-drawer {
          top: auto;
          bottom: 0;
          width: 100vw;
          max-width: 100vw;
          height: min(82vh, 700px);
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -20px 60px -24px rgba(31, 26, 21, 0.38);
          transform: translateY(100%);
        }
        .mrp-cart-drawer.is-open { transform: translateY(0); }
        .mrp-cart-head {
          padding-top: 1rem;
        }
        .mrp-cart-head::before {
          content: '';
          display: block;
          width: 48px;
          height: 5px;
          border-radius: 999px;
          background: rgba(31,26,21,.14);
          margin: 0 auto .9rem;
        }
        .mrp-cart-toast {
          bottom: 92px;
          max-width: calc(100vw - 32px);
          text-align: center;
        }
        .mrp-cart-line-top,
        .mrp-cart-line-bottom,
        .mrp-cart-subtotal,
        .mrp-cart-headline,
        .mrp-cart-head-actions {
          flex-wrap: wrap;
        }
        .mrp-cart-line-bottom {
          gap: .7rem;
        }
        .mrp-cart-checkout {
          min-height: 48px;
        }
      }
      @media (max-width: 480px) {
        .mrp-cart-head,
        .mrp-cart-foot {
          padding-inline: 1rem;
        }
        .mrp-cart-lines {
          padding-inline: 1rem;
        }
        .mrp-cart-line {
          padding: .88rem .9rem;
        }
        .mrp-cart-note {
          font-size: .82rem;
        }
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.className = 'mrp-cart-overlay';
    overlay.setAttribute('data-cart-overlay', '');

    const drawer = document.createElement('aside');
    drawer.className = 'mrp-cart-drawer';
    drawer.setAttribute('data-cart-drawer', '');
    drawer.innerHTML = `
      <div class="mrp-cart-head">
        <div class="mrp-cart-headline">
          <div class="mrp-cart-headline-copy">
            <h3>Cart Preview</h3>
            <p>Preview only until Order My Roti supports direct cart import.</p>
          </div>
          <div class="mrp-cart-head-actions">
            <button type="button" class="mrp-cart-clear" data-cart-clear>Clear cart</button>
            <button type="button" class="mrp-cart-close" data-cart-close aria-label="Close cart">×</button>
          </div>
        </div>
      </div>
      <div class="mrp-cart-lines" data-cart-lines></div>
      <div class="mrp-cart-foot">
        <div class="mrp-cart-subtotal">
          <strong>Subtotal</strong>
          <strong data-cart-subtotal>$0.00</strong>
        </div>
        <p class="mrp-cart-note">Payment is completed securely on Order My Roti.</p>
        <a href="${ORDER_URL}" class="mrp-cart-checkout" data-cart-checkout>Checkout on Order My Roti →</a>
      </div>
    `;

    const launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'mrp-cart-launcher';
    launcher.setAttribute('data-cart-launcher', '');
    launcher.setAttribute('aria-label', 'Open cart preview');
    launcher.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1.6"></circle><circle cx="17" cy="20" r="1.6"></circle><path d="M3 4h2l2.1 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.76L21 7H7.4"></path></svg><span>Cart</span><span class="mrp-cart-launcher-count" data-cart-count>0</span>`;

    const toast = document.createElement('div');
    toast.className = 'mrp-cart-toast';
    toast.setAttribute('data-cart-toast', '');
    toast.textContent = 'Added to cart';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    document.body.appendChild(toast);

    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
      navCta.insertBefore(launcher, navCta.firstChild);
    } else {
      document.body.appendChild(launcher);
    }
  }

  function openDrawer() {
    const overlay = document.querySelector('[data-cart-overlay]');
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!overlay || !drawer) return;
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const overlay = document.querySelector('[data-cart-overlay]');
    const drawer = document.querySelector('[data-cart-drawer]');
    if (!overlay || !drawer) return;
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function renderCart() {
    const cart = readCart();
    const countEl = document.querySelector('[data-cart-count]');
    const linesEl = document.querySelector('[data-cart-lines]');
    const subtotalEl = document.querySelector('[data-cart-subtotal]');
    const checkoutEl = document.querySelector('[data-cart-checkout]');
    if (!countEl || !linesEl || !subtotalEl || !checkoutEl) return;

    countEl.textContent = String(cartCount(cart));
    subtotalEl.textContent = money(cartSubtotal(cart));
    checkoutEl.dataset.previewParam = buildPreviewParam(cart);

    if (!cart.items.length) {
      linesEl.innerHTML = `<p class="mrp-cart-empty">Your cart preview is empty. Add a few favorites and then continue to Order My Roti for checkout.</p>`;
      return;
    }

    linesEl.innerHTML = cart.items.map((item) => {
      const unit = itemUnitPrice(item);
      const qty = Number(item.quantity || 1);
      return `
        <div class="mrp-cart-line">
          <div class="mrp-cart-line-top">
            <span class="mrp-cart-line-name">${item.name || 'Menu item'}</span>
            <strong>${money(itemLineSubtotal(item))}</strong>
          </div>
          <div class="mrp-cart-line-bottom">
            <span class="mrp-cart-line-meta">${money(unit)} each</span>
            <div class="mrp-cart-line-actions">
              <div class="mrp-cart-qty" aria-label="Quantity controls">
                <button type="button" data-cart-qty="${item.id}" data-cart-delta="-1" aria-label="Decrease quantity">−</button>
                <span>${qty}</span>
                <button type="button" data-cart-qty="${item.id}" data-cart-delta="1" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" class="mrp-cart-remove" data-remove-cart-item="${item.id}">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  let toastTimer = null;
  function showToast(message) {
    const toast = document.querySelector('[data-cart-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 1400);
  }

  function bind() {
    document.addEventListener('click', function (event) {
      const addBtn = event.target.closest('.cart-add-btn');
      if (addBtn) {
        event.preventDefault();
        event.stopPropagation();
        addMenuItem({
          id: addBtn.dataset.itemId || `menu-${Date.now()}`,
          type: addBtn.dataset.itemKind || 'menu',
          name: addBtn.dataset.itemName || 'Menu item',
          price: Number(addBtn.dataset.itemPrice || 0)
        });
        renderCart();
        openDrawer();
        showToast('Added to cart');
        addBtn.classList.add('added');
        const original = addBtn.textContent;
        addBtn.textContent = 'Added ✓';
        setTimeout(() => {
          addBtn.classList.remove('added');
          addBtn.textContent = original;
        }, 1300);
        return;
      }

      if (event.target.closest('[data-cart-launcher]')) {
        openDrawer();
        return;
      }
      if (event.target.closest('[data-cart-close]') || event.target.closest('[data-cart-overlay]')) {
        closeDrawer();
        return;
      }
      const removeBtn = event.target.closest('[data-remove-cart-item]');
      if (removeBtn) {
        event.preventDefault();
        removeCartItem(removeBtn.dataset.removeCartItem);
        renderCart();
        showToast('Item removed');
        return;
      }
      const qtyBtn = event.target.closest('[data-cart-qty]');
      if (qtyBtn) {
        event.preventDefault();
        updateCartItemQuantity(qtyBtn.dataset.cartQty, Number(qtyBtn.dataset.cartDelta || 0));
        renderCart();
        return;
      }
      if (event.target.closest('[data-cart-clear]')) {
        event.preventDefault();
        clearCart();
        renderCart();
        showToast('Cart cleared');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeDrawer();
    });

    document.addEventListener('mrp-cart-updated', renderCart);
  }

  function boot() {
    injectUi();
    bind();
    renderCart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
