(function () {
  const DATA_PATH = 'data/builder.json';
  const CART_KEY = 'mrp-cart';

  const qs = (selector) => document.querySelector(selector);
  const qsa = (selector) => Array.from(document.querySelectorAll(selector));

  const formatPrice = (value) => `$${Number(value).toFixed(2)}`;

  const stepTitles = {
    base: 'Choose base',
    protein: 'Choose protein',
    curry: 'Pick curry',
    spice: 'Choose heat'
  };

  const stepDescriptions = {
    base: 'Choose the base that matches how you want to eat right now.',
    protein: 'Pick the main protein that sets the price for the build.',
    curry: 'Lock in the sauce profile that carries the whole bowl or roti.',
    spice: 'Dial the heat from easygoing to reckless.'
  };

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

  function addBuildToCart(payload) {
    const cart = readCart();
    cart.items.push(payload);
    cart.updatedAt = new Date().toISOString();
    writeCart(cart);
    return cart;
  }

  function renderOption(option, stepIndex, currentSelection) {
    const selected = currentSelection && currentSelection.id === option.id;
    const recommended = option.recommended ? ' recommended' : '';
    const isSelected = selected ? ' selected' : '';
    const tags = (option.tags || [])
      .map((tag) => {
        const tone = tag.toLowerCase() === 'vegan' ? 'v' : tag.toLowerCase() === 'gf' ? 'gf' : 'pop';
        return `<span class="opt-tag ${tone}">${tag}</span>`;
      })
      .join('');

    return `
      <button
        type="button"
        class="builder-opt${recommended}${isSelected}"
        data-step-index="${stepIndex}"
        data-option-id="${option.id}"
      >
        <span class="builder-opt-name">${option.name}</span>
        <span class="builder-opt-price">${option.priceLabel}</span>
        ${tags ? `<span class="builder-opt-tags">${tags}</span>` : ''}
      </button>
    `;
  }

  function mountBuilder(data) {
    const root = qs('[data-builder-root]');
    if (!root) return;

    const steps = data.steps || [];
    const state = {
      activeStep: 0,
      selections: steps.map((step) => step.options.find((option) => option.recommended) || step.options[0] || null)
    };

    function totalPrice() {
      const base = state.selections[0] ? Number(state.selections[0].price || 0) : 0;
      const protein = state.selections[1] ? Number(state.selections[1].price || 0) : 0;
      return protein + base;
    }

    function summaryMarkup() {
      return `
        <div class="builder-order-summary-card">
          <span class="builder-summary-kicker">Ready to order</span>
          <h3>Your build</h3>
          <ul class="builder-order-lines">
            ${steps.map((step, index) => `
              <li>
                <span>${step.label}</span>
                <strong>${state.selections[index] ? state.selections[index].name : 'Choose one'}</strong>
              </li>
            `).join('')}
          </ul>
          <div class="builder-order-total">
            <span>Total</span>
            <strong>${formatPrice(totalPrice())}</strong>
          </div>
          <button type="button" class="builder-add-cart" data-builder-add>Add Build Your Own to Cart</button>
          <p class="builder-cart-note" data-builder-cart-note></p>
        </div>
      `;
    }

    function render() {
      root.innerHTML = `
        <div class="builder-shell">
          <div class="builder-shell-main">
            <div class="builder-shell-head">
              <div>
                <span class="eyebrow">Build Your Own Roti</span>
                <h2>Customize your roti <em>in four quick steps.</em></h2>
                <p>Pick your base, choose your protein, select a curry, and dial the spice just the way you like it.</p>
              </div>
              <a href="#combos" class="btn btn-outline builder-combo-link">Prefer a combo?</a>
            </div>

            <div class="builder-steps-nav" role="tablist" aria-label="Build your own steps">
              ${steps.map((step, index) => {
                const done = index < state.activeStep ? ' done' : '';
                const active = index === state.activeStep ? ' active' : '';
                return `
                  <button
                    type="button"
                    class="builder-step-tab${active}${done}"
                    data-builder-tab="${index}"
                    aria-selected="${index === state.activeStep ? 'true' : 'false'}"
                  >
                    <span class="builder-step-num">${index + 1}</span>
                    <span class="builder-step-label">${step.label}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <div class="builder-panel">
              <div class="builder-panel-copy">
                <span class="builder-panel-kicker">${stepTitles[steps[state.activeStep].id] || steps[state.activeStep].label}</span>
                <h3>${steps[state.activeStep].label}</h3>
                <p>${stepDescriptions[steps[state.activeStep].id] || ''}</p>
              </div>
              <div class="builder-option-grid">
                ${steps[state.activeStep].options.map((option) => renderOption(option, state.activeStep, state.selections[state.activeStep])).join('')}
              </div>
            </div>

            <div class="builder-nav-row">
              <button type="button" class="builder-nav-btn secondary" data-builder-prev ${state.activeStep === 0 ? 'disabled' : ''}>← Back</button>
              <button type="button" class="builder-nav-btn" data-builder-next ${state.activeStep === steps.length - 1 ? 'disabled' : ''}>${state.activeStep === steps.length - 1 ? 'Done' : `Next: ${steps[state.activeStep + 1].label} →`}</button>
            </div>

            <div class="builder-summary-stick">
              <div class="builder-summary-chips">
                ${steps.map((step, index) => `
                  <span class="builder-summary-chip${state.selections[index] ? '' : ' empty'}">
                    ${state.selections[index] ? state.selections[index].name : step.label}
                  </span>
                `).join('')}
              </div>
              <span class="builder-summary-total">${formatPrice(totalPrice())}</span>
            </div>
          </div>

          <aside class="builder-shell-side">
            ${summaryMarkup()}
          </aside>
        </div>
      `;

      bind();
    }

    function bind() {
      qsa('[data-builder-tab]').forEach((button) => {
        button.addEventListener('click', () => {
          state.activeStep = Number(button.dataset.builderTab);
          render();
        });
      });

      qsa('[data-step-index]').forEach((button) => {
        button.addEventListener('click', () => {
          const stepIndex = Number(button.dataset.stepIndex);
          const optionId = button.dataset.optionId;
          const option = steps[stepIndex].options.find((entry) => entry.id === optionId);
          state.selections[stepIndex] = option;
          render();
        });
      });

      const prev = qs('[data-builder-prev]');
      const next = qs('[data-builder-next]');
      const add = qs('[data-builder-add]');

      if (prev) {
        prev.addEventListener('click', () => {
          if (state.activeStep > 0) {
            state.activeStep -= 1;
            render();
          }
        });
      }

      if (next) {
        next.addEventListener('click', () => {
          if (state.activeStep < steps.length - 1) {
            state.activeStep += 1;
            render();
          }
        });
      }

      if (add) {
        add.addEventListener('click', () => {
          const payload = {
            id: `build-${Date.now()}`,
            type: 'build-your-own',
            name: 'Build Your Own Roti',
            selections: steps.reduce((acc, step, index) => {
              acc[step.id] = state.selections[index] ? state.selections[index].name : null;
              return acc;
            }, {}),
            totalPrice: totalPrice(),
            quantity: 1
          };

          addBuildToCart(payload);

          const note = qs('[data-builder-cart-note]');
          if (note) {
            note.textContent = 'Added to cart preview. Your custom build is saved on this device.';
          }
        });
      }
    }

    render();
  }

  async function boot() {
    const root = qs('[data-builder-root]');
    if (!root) return;

    try {
      const response = await fetch(DATA_PATH, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Builder data request failed: ${response.status}`);
      const data = await response.json();
      mountBuilder(data);
    } catch (error) {
      console.warn('Builder flow fallback:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
