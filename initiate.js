/* global Splide */
(function () {
  'use strict';

  const restructureColumns = (containerEl, containerSelector, itemSelector = '.splide__slide') => {
    if (!containerEl.matches(containerSelector)) {
      containerEl = containerEl.querySelector(containerSelector);
    }
    if (!containerEl) return;

    const ordered = [], unordered = [];

    containerEl.querySelectorAll(itemSelector).forEach(col => {
      if (col.classList.contains('d-none') || col.dataset.display === 'hide') {
        col.remove();
        return;
      }
      const orderClass = [...col.classList].find(c => /^order-\d+$/.test(c));
      if (orderClass) {
        const n = parseInt(orderClass.split('-')[1], 10);
        if (isNaN(n)) unordered.push(col);
        else ordered.push({ el: col, order: n });
        [...col.classList].filter(c => c.startsWith('order-')).forEach(c => col.classList.remove(c));
      } else {
        unordered.push(col);
      }
    });

    ordered.sort((a, b) => a.order - b.order);
    [...ordered.map(o => o.el), ...unordered].forEach(e => containerEl.appendChild(e));
  };

  var splideEls = document.querySelectorAll('[data-slider="ready"]');
  if (!splideEls.length) return;

  let splideInstances = [];
    
  window._mountSplideEl = function(splideEl) {

    if (splideEl.dataset.restructureColumns === 'true') restructureColumns(splideEl, '.splide__list');

    /* Items */
    const itemsXs = splideEl.dataset.items || 1;
    const itemsSm = splideEl.dataset.itemsSm || itemsXs;
    const itemsMd = splideEl.dataset.itemsMd || itemsSm;
    const itemsLg = splideEl.dataset.itemsLg || itemsMd;
    const itemsXl = splideEl.dataset.itemsXl || itemsLg;
    const itemsXxl = splideEl.dataset.itemsXxl || itemsXl;
    splideEl.style.setProperty('--items-xs', itemsXs);
    splideEl.style.setProperty('--items-sm', itemsSm);
    splideEl.style.setProperty('--items-md', itemsMd);
    splideEl.style.setProperty('--items-lg', itemsLg);
    splideEl.style.setProperty('--items-xl', itemsXl);
    splideEl.style.setProperty('--items-xxl', itemsXxl);

    /* Gap */
    const gapXs = splideEl.dataset.gap || '1rem';
    const gapSm = splideEl.dataset.gapSm || gapXs;
    const gapMd = splideEl.dataset.gapMd || gapSm;
    const gapLg = splideEl.dataset.gapLg || gapMd;
    const gapXl = splideEl.dataset.gapXl || gapLg;
    const gapXxl = splideEl.dataset.gapXxl || gapXl;
    splideEl.style.setProperty('--gap-xs', gapXs);
    splideEl.style.setProperty('--gap-sm', gapSm);
    splideEl.style.setProperty('--gap-md', gapMd);
    splideEl.style.setProperty('--gap-lg', gapLg);
    splideEl.style.setProperty('--gap-xl', gapXl);
    splideEl.style.setProperty('--gap-xxl', gapXxl);

    // Options
    const options = {
      drag: 'free', 
      snap: true,
      flickPower: 300,  
      arrows: false,
      pagination: false,
      padding: { 
          left: 'var(--padding-width)',
          right: 'var(--padding-width)'
        },
      mediaQuery: 'min',
      gap: 0, // Pass gap to Splide so it can include it in its position calculations
      autoWidth: true
    }

    // Mount
    const splide = new Splide(splideEl, options).mount();
    splideEl.splideInstance = splide; // Store instance on element for later reference
    splideEl.dataset.sliderStatus = 'mounted';
    splideInstances.push(splide);

    // Wire up custom nav buttons and sync their disabled state.
    const btnPrev = splideEl.querySelector('[data-splide-go="prev"]');
    const btnNext = splideEl.querySelector('[data-splide-go="next"]');
    if (btnPrev || btnNext) {
      if (btnPrev) btnPrev.addEventListener('click', () => splide.go('<'));
      if (btnNext) btnNext.addEventListener('click', () => splide.go('>'));
      const sync = () => {
        if (btnPrev) btnPrev.disabled = splide.index === 0;
        if (btnNext) btnNext.disabled = splide.index === splide.Components.Controller.getEnd();
      };
      sync();
      splide.on('moved', sync);
    }

  };

  // ── Boot ───────────────────────────────────────────────────────────────────
  function init() {
    document.querySelectorAll('[data-slider="ready"]').forEach(window._mountSplideEl);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
