(function () {
  const DATA_PATH = 'data/menu.json';
  const ORDER_URL = 'https://ordermyroti.com';

  const ART_MAP = {
    'chicken-tikka-roti': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#C4861C"/><ellipse cx="200" cy="155" rx="145" ry="85" fill="#F6EFE2"/><ellipse cx="200" cy="150" rx="132" ry="72" fill="#C0382C"/><circle cx="150" cy="140" r="10" fill="#F6EFE2" opacity=".8"/><circle cx="235" cy="150" r="9" fill="#F6EFE2" opacity=".7"/><circle cx="195" cy="175" r="8" fill="#5B6E3A" opacity=".9"/></svg>`,
    'paneer-tikka-roti': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#E8A530"/><ellipse cx="200" cy="155" rx="150" ry="88" fill="#F6EFE2"/><ellipse cx="200" cy="150" rx="138" ry="76" fill="#C0382C"/><rect x="145" y="114" width="26" height="26" rx="6" fill="#F6EFE2"/><rect x="225" y="130" width="26" height="26" rx="6" fill="#F6EFE2"/><rect x="188" y="174" width="26" height="26" rx="6" fill="#F6EFE2"/></svg>`,
    'lamb-seekh-roti': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#7A1D14"/><ellipse cx="200" cy="160" rx="145" ry="85" fill="#F2B648"/><ellipse cx="200" cy="155" rx="132" ry="72" fill="#A13122"/><rect x="105" y="148" width="190" height="10" rx="5" fill="#2B2520"/><circle cx="150" cy="140" r="7" fill="#F6EFE2"/><circle cx="250" cy="175" r="6" fill="#F6EFE2"/></svg>`,
    'hyderabadi-dum-biryani': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#7A1D14"/><ellipse cx="200" cy="150" rx="150" ry="88" fill="#F2B648"/><ellipse cx="200" cy="145" rx="138" ry="76" fill="#C0382C"/><circle cx="150" cy="122" r="8" fill="#FFCD3C"/><circle cx="235" cy="140" r="7" fill="#FFCD3C"/><circle cx="195" cy="172" r="7" fill="#5B6E3A"/></svg>`,
    'lamb-biryani': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#A13122"/><ellipse cx="200" cy="150" rx="150" ry="88" fill="#F2B648"/><ellipse cx="200" cy="145" rx="138" ry="76" fill="#8A4B1E"/><circle cx="150" cy="126" r="9" fill="#F6EFE2" opacity=".7"/><circle cx="240" cy="150" r="8" fill="#F6EFE2" opacity=".65"/></svg>`,
    'pani-puri': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#E8A530"/><circle cx="125" cy="145" r="55" fill="#C4861C"/><circle cx="205" cy="145" r="55" fill="#D89A45"/><circle cx="285" cy="145" r="55" fill="#E2AF59"/></svg>`,
    'samosa-2pc': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#F6EFE2"/><path d="M110 210L180 70L250 210H110Z" fill="#D89A45"/><path d="M180 220L255 95L330 220H180Z" fill="#E2AF59"/></svg>`,
    'mango-coconut-tofu-bowl': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#E8A530"/><ellipse cx="200" cy="155" rx="150" ry="88" fill="#F6EFE2"/><ellipse cx="200" cy="150" rx="138" ry="76" fill="#F2B648"/><circle cx="150" cy="130" r="16" fill="#F6EFE2"/><circle cx="205" cy="115" r="18" fill="#F6EFE2"/><circle cx="255" cy="145" r="15" fill="#F6EFE2"/><circle cx="190" cy="175" r="14" fill="#5B6E3A" opacity=".7"/></svg>`,
    'plain-butter-roti': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#F6EFE2"/><ellipse cx="200" cy="155" rx="130" ry="85" fill="#EBD7B6"/><circle cx="165" cy="130" r="10" fill="#D9B278"/><circle cx="225" cy="165" r="12" fill="#D9B278"/></svg>`,
    'raita': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#E8F0EA"/><ellipse cx="200" cy="160" rx="125" ry="70" fill="#F6EFE2"/><circle cx="170" cy="145" r="10" fill="#8FB7A0"/><circle cx="220" cy="170" r="8" fill="#8FB7A0"/></svg>`,
    'papadum-3pc': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#F7F1E8"/><path d="M90 170C140 85 260 85 310 170C260 220 140 220 90 170Z" fill="#E2C27D"/></svg>`,
    'masala-fries': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#D85C28"/><rect x="125" y="70" width="35" height="150" rx="17" fill="#F4C95D"/><rect x="170" y="55" width="35" height="165" rx="17" fill="#F4C95D"/><rect x="215" y="65" width="35" height="155" rx="17" fill="#F4C95D"/><rect x="260" y="78" width="35" height="142" rx="17" fill="#F4C95D"/></svg>`,
    'mango-lassi': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#F2DEB8"/><path d="M150 70H250L230 240C228 260 210 275 190 275H210C190 275 172 260 170 240L150 70Z" fill="#F6EFE2"/><circle cx="200" cy="150" r="45" fill="#F4C95D"/></svg>`,
    'gulab-jamun': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#F6EFE2"/><circle cx="165" cy="155" r="38" fill="#A84B23"/><circle cx="235" cy="155" r="38" fill="#B05526"/></svg>`,
    'masala-chai': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#EAD8C3"/><rect x="125" y="105" width="150" height="100" rx="18" fill="#A85B2C"/><rect x="255" y="120" width="30" height="55" rx="15" fill="#A85B2C"/><rect x="115" y="95" width="170" height="18" rx="9" fill="#F6EFE2"/></svg>`,
    'rose-lassi': `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#F1DCE8"/><path d="M150 70H250L230 240C228 260 210 275 190 275H210C190 275 172 260 170 240L150 70Z" fill="#F6EFE2"/><circle cx="200" cy="150" r="45" fill="#D989B5"/></svg>`,
    'combo-comfort-combo': `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="combo-comfort-grad" cx="42%" cy="38%" r="62%"><stop offset="0%" stop-color="#F2B648"/><stop offset="58%" stop-color="#C0382C"/><stop offset="100%" stop-color="#7A1D14"/></radialGradient></defs><rect width="400" height="250" fill="#D89A45"/><ellipse cx="200" cy="135" rx="160" ry="95" fill="#9E2B1F"/><ellipse cx="200" cy="130" rx="148" ry="83" fill="url(#combo-comfort-grad)"/><circle cx="154" cy="112" r="11" fill="#F6EFE2" opacity=".72"/><circle cx="230" cy="126" r="9" fill="#F6EFE2" opacity=".56"/><circle cx="195" cy="149" r="8" fill="#5B6E3A" opacity=".82"/><ellipse cx="316" cy="186" rx="54" ry="22" fill="#F6EFE2" opacity=".96"/><path d="M 174 60 Q 168 40, 180 22" stroke="rgba(246,239,226,.5)" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
    'combo-kk-classic': `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="home-cw1" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="#F2B648"/><stop offset="55%" stop-color="#C0382C"/><stop offset="100%" stop-color="#7A1D14"/></radialGradient></defs><rect width="400" height="250" fill="#E8A530"/><ellipse cx="200" cy="135" rx="160" ry="95" fill="#9E2B1F"/><ellipse cx="200" cy="130" rx="148" ry="83" fill="url(#home-cw1)"/><circle cx="160" cy="110" r="11" fill="#F6EFE2" opacity=".7"/><circle cx="225" cy="125" r="9" fill="#F6EFE2" opacity=".55"/><circle cx="195" cy="148" r="8" fill="#5B6E3A" opacity=".85"/><ellipse cx="320" cy="185" rx="55" ry="22" fill="#F6EFE2" opacity=".95"/><path d="M 175 60 Q 170 40, 180 22" stroke="rgba(246,239,226,.5)" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
    'combo-90-second-biryani': `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice"><rect width="400" height="250" fill="#7A1D14"/><ellipse cx="200" cy="138" rx="160" ry="94" fill="#F2B648"/><ellipse cx="200" cy="132" rx="147" ry="81" fill="#C4861C"/><circle cx="150" cy="112" r="10" fill="#FFCD3C"/><circle cx="236" cy="126" r="8" fill="#FFCD3C"/><circle cx="195" cy="157" r="7" fill="#5B6E3A"/><circle cx="170" cy="148" r="6" fill="#F6EFE2" opacity=".7"/><circle cx="250" cy="154" r="5" fill="#F6EFE2" opacity=".65"/><rect x="286" y="54" width="68" height="36" rx="18" fill="#F6EFE2" opacity=".95"/><text x="320" y="78" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#7A1D14">90s</text></svg>`,
    'combo-big-plate': `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice"><rect width="400" height="250" fill="#C4861C"/><path d="M 50 40 L 350 40 L 320 230 L 80 230 Z" fill="#F2B648"/><path d="M 70 55 L 330 55 L 305 220 L 95 220 Z" fill="#E8A530"/><circle cx="140" cy="130" r="11" fill="#9E2B1F"/><circle cx="200" cy="115" r="9" fill="#9E2B1F"/><circle cx="260" cy="135" r="10" fill="#9E2B1F"/><circle cx="170" cy="165" r="8" fill="#5B6E3A"/><circle cx="230" cy="170" r="9" fill="#5B6E3A"/><circle cx="180" cy="195" r="6" fill="#F6EFE2"/><circle cx="270" cy="190" r="7" fill="#F6EFE2"/></svg>`,
    'combo-vegan-hero': `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice"><rect width="400" height="250" fill="#5B6E3A"/><ellipse cx="200" cy="135" rx="158" ry="92" fill="#F2B648"/><ellipse cx="200" cy="130" rx="146" ry="80" fill="#E8A530"/><g fill="#F2B648"><circle cx="145" cy="115" r="18"/><circle cx="190" cy="100" r="20"/><circle cx="235" cy="115" r="18"/><circle cx="265" cy="145" r="17"/><circle cx="220" cy="155" r="19"/><circle cx="160" cy="155" r="17"/><circle cx="200" cy="180" r="15"/></g><g fill="#9E2B1F" opacity=".8"><circle cx="190" cy="100" r="5"/><circle cx="235" cy="115" r="4"/><circle cx="265" cy="145" r="4"/><circle cx="220" cy="155" r="4"/></g></svg>`,
    'combo-2am-pack': `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice"><rect width="400" height="250" fill="#7A1D14"/><g fill="#F2B648"><rect x="115" y="80" width="20" height="125" rx="3" transform="rotate(-8 125 142)"/><rect x="148" y="75" width="20" height="135" rx="3" transform="rotate(4 158 142)"/><rect x="180" y="80" width="20" height="130" rx="3" transform="rotate(-5 190 145)"/><rect x="212" y="70" width="20" height="140" rx="3" transform="rotate(7 222 140)"/><rect x="245" y="80" width="20" height="130" rx="3" transform="rotate(-3 255 145)"/><rect x="278" y="85" width="20" height="120" rx="3" transform="rotate(10 288 145)"/></g><ellipse cx="200" cy="160" rx="105" ry="25" fill="#E8A530" opacity=".9"/><ellipse cx="200" cy="165" rx="90" ry="20" fill="#9E2B1F" opacity=".95"/><circle cx="160" cy="155" r="6" fill="#F6EFE2"/><circle cx="235" cy="160" r="5" fill="#F6EFE2"/><circle cx="195" cy="175" r="5" fill="#F6EFE2"/></svg>`,
    'combo-spice-seeker': `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="home-cw5" cx="50%" cy="50%" r="65%"><stop offset="0%" stop-color="#FF5733"/><stop offset="50%" stop-color="#D73020"/><stop offset="100%" stop-color="#5C0A05"/></radialGradient></defs><rect width="400" height="250" fill="#7A1D14"/><ellipse cx="200" cy="135" rx="160" ry="93" fill="#5C0A05"/><ellipse cx="200" cy="130" rx="148" ry="82" fill="url(#home-cw5)"/><path d="M 165 105 L 175 110 L 168 122 Z" fill="#FFCD3C"/><path d="M 220 115 L 232 118 L 225 130 Z" fill="#FFCD3C"/><path d="M 195 145 L 205 148 L 200 160 Z" fill="#FFCD3C"/><circle cx="180" cy="135" r="6" fill="#1F1A15" opacity=".8"/><circle cx="240" cy="155" r="5" fill="#1F1A15" opacity=".8"/></svg>`,
    'combo-family-feast': `<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice"><rect width="400" height="250" fill="#9E2B1F"/><ellipse cx="115" cy="100" rx="65" ry="38" fill="#F2B648"/><ellipse cx="115" cy="98" rx="58" ry="32" fill="#C0382C"/><ellipse cx="285" cy="100" rx="65" ry="38" fill="#F2B648"/><ellipse cx="285" cy="98" rx="58" ry="32" fill="#E8A530"/><ellipse cx="115" cy="180" rx="65" ry="38" fill="#F2B648"/><ellipse cx="115" cy="178" rx="58" ry="32" fill="#5B6E3A"/><ellipse cx="285" cy="180" rx="65" ry="38" fill="#F2B648"/><ellipse cx="285" cy="178" rx="58" ry="32" fill="#7A1D14"/><circle cx="100" cy="92" r="5" fill="#F6EFE2"/><circle cx="270" cy="92" r="4" fill="#F6EFE2"/><circle cx="100" cy="175" r="4" fill="#F6EFE2"/><circle cx="270" cy="175" r="5" fill="#F6EFE2"/></svg>`
  };

  const escapeHtml = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const formatPrice = (value) => `$${Number(value).toFixed(2)}`;

  const renderImageOrArt = (item) => {
    const alt = escapeHtml(item.name || 'Menu item');
    if (item.image) {
      return `<img src="${escapeHtml(item.image)}" alt="${alt}" loading="lazy">`;
    }
    if (item.artKey && ART_MAP[item.artKey]) {
      return ART_MAP[item.artKey];
    }
    return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#F6EFE2"></rect><circle cx="200" cy="150" r="90" fill="#E8A530"></circle></svg>`;
  };

  const getToneClass = (tone) => {
    if (tone === 'safe') return 'safe';
    if (tone === 'late-night') return 'late-night';
    if (tone === 'vegan') return 'vegan';
    if (tone === 'most-ordered') return 'most-ordered';
    if (tone === 'premium') return 'premium';
    if (tone === 'side') return 'side';
    return '';
  };

  const renderHitTag = (item) => {
    const text = (item.badges && item.badges[0]) || '';
    const tone = item.badgeTone || 'default';
    const cls = getToneClass(tone);
    const styles = tone === 'vegan' ? ' style="background:var(--leaf);color:var(--cream);"' : '';
    const dotStyles = tone === 'vegan' ? ' style="background:#a8d08d;"' : tone === 'premium' ? ' style="background:var(--saffron);"' : '';
    return text ? `<span class="hit-tag ${cls}"${styles}><span class="tdot"${dotStyles}></span>${escapeHtml(text)}</span>` : '';
  };

  const renderHeat = (item) => {
    if (!item.heatLabel || !item.heatLevel) return '';
    const flames = Array.from({ length: 5 }, (_, index) => `<span class="mini-flame${index < item.heatLevel ? ' on' : ''}"></span>`).join('');
    return `<span class="hit-heat">${flames} ${escapeHtml(item.heatLabel)}</span>`;
  };

  const renderUpsellLine = (item, modalMode) => {
    if (!item.upsellLabel) return '';
    const btnClass = modalMode ? ' class="upsell-btn" data-order-url="' + escapeHtml(ORDER_URL) + '"' : '';
    return `<div class="upsell-line"><button type="button"${btnClass}>${escapeHtml(item.upsellLabel)}</button><span class="upsell-line-price">+${item.upsellPrice ? '$' + Number(item.upsellPrice).toFixed(0) : ''}</span><span class="upsell-line-note">· ${escapeHtml(item.upsellNote || item.upsellText || '')}</span></div>`;
  };

  const renderIndexHitCard = (item, modalMode) => {
    const filters = Array.isArray(item.filters) ? item.filters.filter((filterName) => filterName !== 'all').join(' ') : '';
    const addControl = modalMode
      ? `<button type="button" class="hit-add add-btn cart-add-btn" data-item-id="${escapeHtml(item.id)}" data-item-kind="${escapeHtml(item.kind || 'menu')}" data-item-name="${escapeHtml(item.name)}" data-item-price="${escapeHtml(item.price)}" data-upsell="${escapeHtml(item.addUpsellPrompt || item.upsellText || '')}" data-order-url="${escapeHtml(ORDER_URL)}">Add →</button>`
      : `<button type="button" class="hit-add cart-add-btn" data-item-id="${escapeHtml(item.id)}" data-item-kind="${escapeHtml(item.kind || 'menu')}" data-item-name="${escapeHtml(item.name)}" data-item-price="${escapeHtml(item.price)}" data-order-url="${escapeHtml(ORDER_URL)}">Add →</button>`;
    const nr1 = item.badges && item.badges[1] ? `<span class="nr1-badge">${escapeHtml(item.badges[1])}</span>` : '';
    const cardClass = item.id === 'chole-chawal' && modalMode ? ' vegan-card' : '';
    const desc = modalMode ? (item.homepageDescription || item.description) : (item.sectionDescription || item.homepageDescription || item.description);
    return `<article class="hit-card${cardClass}" data-item="${escapeHtml(item.name)}" data-item-id="${escapeHtml(item.id || '')}" data-filters="${escapeHtml(filters)}"><div class="hit-photo">${renderHitTag(item)}${renderHeat(item)}${renderImageOrArt(item)}</div><div class="hit-body">${nr1}<h3>${escapeHtml(item.name)}</h3><p class="hit-benefit">✓ ${escapeHtml(desc)}</p><div class="hit-foot"><div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;"><span class="hit-price">${formatPrice(item.price)}</span>${addControl}</div>${renderUpsellLine(item, modalMode)}</div></div></article>`;
  };

  const renderComboCard = (item) => {
    const featured = item.featured ? ' featured' : '';
    const includes = (item.includes || []).map((part) => `<li>${escapeHtml(part)}</li>`).join('');
    return `<article class="combo-card${featured}" data-item-id="${escapeHtml(item.id || '')}" data-item="${escapeHtml(item.name)}"><div class="combo-photo"><span class="combo-intent ${escapeHtml(item.intentClass || '')}">${escapeHtml(item.intent || '')}</span>${renderImageOrArt(item)}</div><div class="combo-card-body"><h3>${escapeHtml(item.name)}</h3><div class="combo-who"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>${escapeHtml(item.prepNote || item.description)}</div><ul class="combo-includes">${includes}</ul><div class="combo-foot"><div class="combo-pricing"><span class="combo-price">${formatPrice(item.price)}</span><span class="combo-saves">${escapeHtml(item.saves || item.upsellText || '')}</span></div><a href="${escapeHtml(ORDER_URL)}" class="combo-order-btn">Order <span class="arr">→</span></a></div></div></article>`;
  };

  const renderMenuPageBestSellerCard = (item, index) => {
    const featured = index === 0 ? ' featured' : '';
    const nr1 = item.badges && item.badges[1] ? `<span class="nr1-badge">${escapeHtml(item.badges[1])}</span>` : '';
    return `<article class="hit-card${featured}" data-item-id="${escapeHtml(item.id || '')}" data-item="${escapeHtml(item.name)}"><div class="hit-photo">${renderHitTag(item)}${renderImageOrArt(item)}</div><div class="hit-body">${nr1}<h3>${escapeHtml(item.name)}</h3><p class="hit-benefit">✓ ${escapeHtml(item.homepageDescription || item.description)}</p><div class="hit-foot"><div class="hit-foot-row"><span class="hit-price">${formatPrice(item.price)}</span><button type="button" class="hit-add cart-add-btn" data-item-id="${escapeHtml(item.id)}" data-item-kind="${escapeHtml(item.kind || 'menu')}" data-item-name="${escapeHtml(item.name)}" data-item-price="${escapeHtml(item.price)}" data-order-url="${escapeHtml(ORDER_URL)}">Add →</button></div><div class="upsell-line"><button type="button">${escapeHtml(item.upsellLabel || '')}</button><span class="upsell-price">+${item.upsellPrice ? '$' + Number(item.upsellPrice).toFixed(0) : ''}</span><span>· ${escapeHtml(item.upsellNote || '')}</span></div></div></div></article>`;
  };

  const renderMenuListItem = (item) => {
    const tag = item.menuPageTag ? ` <span class="item-tag v">${escapeHtml(item.menuPageTag)}</span>` : '';
    const description = item.menuPageDescription || item.description;
    return `<div class="menu-item"><div class="menu-item-info"><h4>${escapeHtml(item.name)}${tag}</h4><p>${escapeHtml(description)}</p></div><div class="item-price">${formatPrice(item.price)}</div></div>`;
  };

  const findItems = (allItems, ids) => {
    const byId = new Map(allItems.map((item) => [item.id, item]));
    return (ids || []).map((id) => byId.get(id)).filter((item) => item && item.available !== false);
  };

  const findItemsByCategory = (allItems, category) => {
    return (allItems || []).filter((item) => item && item.available !== false && item.category === category);
  };

  const renderIndexPage = (data) => {
    if (!document.querySelector('#menu .mo-grid')) return;
    const items = data.items || [];
    const view = (data.views && data.views.homepage) || {};

    const popularGrid = document.querySelector('#menu .mo-grid');
    if (popularGrid) {
      const popularItems = findItems(items, view.popular);
      popularGrid.innerHTML = popularItems.map((item) => renderIndexHitCard(item, true)).join('');
    }

    const comboGrid = document.querySelector('#combos .combo-grid');
    if (comboGrid) {
      comboGrid.innerHTML = findItems(items, view.combos).map(renderComboCard).join('');
    }

    const lateNightComboGrid = document.querySelector('#combos [data-late-night-combos]');
    if (lateNightComboGrid) {
      lateNightComboGrid.innerHTML = findItems(items, view.lateNightCombos).map(renderComboCard).join('');
    }

    const categorySections = {
      'signature-rotis': 'Signature Rotis',
      'biryani': 'Biryani',
      'apps-hits': 'Apps & Hits',
      'vegan-picks': 'Vegan Picks',
      'sides': 'Sides',
      'desserts-drinks': 'Desserts & Drinks'
    };
    Object.entries(categorySections).forEach(([sectionId, categoryName]) => {
      const grid = document.querySelector(`#${sectionId} .mo-grid`);
      if (!grid) return;
      grid.innerHTML = findItemsByCategory(items, categoryName).map((item) => renderIndexHitCard(item, false)).join('');
    });

    const filterCounts = view.popularFilterCounts || {};
    document.querySelectorAll('#menu .filter-chip').forEach((chip) => {
      const filterName = chip.dataset.filter;
      const countEl = chip.querySelector('.count');
      if (countEl && Object.prototype.hasOwnProperty.call(filterCounts, filterName)) {
        countEl.textContent = filterCounts[filterName];
      }
      chip.addEventListener('click', () => {
        document.querySelectorAll('#menu .filter-chip').forEach((otherChip) => otherChip.classList.remove('active'));
        chip.classList.add('active');
        document.querySelectorAll('#menu .hit-card').forEach((card) => {
          if (filterName === 'all') {
            card.hidden = false;
            card.style.display = '';
            return;
          }
          const filters = (card.dataset.filters || '').split(/\s+/).filter(Boolean);
          const shouldShow = filters.includes(filterName);
          card.hidden = !shouldShow;
          card.style.display = shouldShow ? '' : 'none';
        });
      });
    });
  };

  const renderMenuPage = (data) => {
    if (!document.querySelector('#best-sellers .hits-grid')) return;
    const items = data.items || [];
    const view = (data.views && data.views.menuPage) || {};

    const bestSellers = document.querySelector('#best-sellers .hits-grid');
    if (bestSellers) {
      bestSellers.innerHTML = findItems(items, view['best-sellers']).map((item, index) => renderMenuPageBestSellerCard(item, index)).join('');
    }

    const categorySections = {
      'biryani': 'Biryani',
      'apps': 'Apps & Hits',
      'vegan': 'Vegan Picks',
      'signature-rotis': 'Signature Rotis',
      'sides': 'Sides'
    };

    Object.entries(categorySections).forEach(([sectionId, categoryName]) => {
      const grid = document.querySelector(`#${sectionId} .menu-grid`);
      if (!grid) return;
      grid.innerHTML = findItemsByCategory(items, categoryName).map(renderMenuListItem).join('');
    });

    const fallbackViewSections = {
      'desserts': view.desserts,
      'drinks': view.drinks
    };

    Object.entries(fallbackViewSections).forEach(([sectionId, ids]) => {
      const grid = document.querySelector(`#${sectionId} .menu-grid`);
      if (!grid) return;
      grid.innerHTML = findItems(items, ids).map(renderMenuListItem).join('');
    });
  };

  const boot = async () => {
    try {
      const response = await fetch(DATA_PATH, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Menu data request failed: ${response.status}`);
      const data = await response.json();
      console.log(`[MRP menu] loaded ${Array.isArray(data.items) ? data.items.length : 0} items from ${DATA_PATH}`);
      renderIndexPage(data);
      renderMenuPage(data);
      document.dispatchEvent(new CustomEvent('mrp-menu-rendered'));
    } catch (error) {
      console.warn('MRP menu renderer fallback:', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
