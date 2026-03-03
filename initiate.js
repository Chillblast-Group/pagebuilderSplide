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


const mountSplideEls = () => {
  document.querySelectorAll('[data-slider="initial"]').forEach(el => {
    el.dataset.slider = 'ready';

    if (el.dataset.restructureColumns === 'true') restructureColumns(el, '.splide__list');

    const isAuto = el.dataset.items === 'auto' || el.dataset.splideItems === 'auto';

    // Build per-breakpoint items & gap with cascade fallback.
    const BPS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const items = {}, gaps = {};
    let curItems = parseFloat(el.dataset.items) || 1;
    let curGap   = el.dataset.gap || '0';

    for (const bp of BPS) {
      const cap = bp[0].toUpperCase() + bp.slice(1);
      const iv = parseFloat(el.dataset[`items${cap}`]);
      const gv = el.dataset[`gap${cap}`];
      if (!isNaN(iv)) curItems = iv;
      if (gv != null) curGap = gv;
      items[bp] = curItems;
      gaps[bp]  = curGap;
    }

    const buildBp = bp => {
      const n = items[bp];
      return {
        gap: gaps[bp],
        ...(isAuto ? {} : { perPage: Math.floor(n) }),
        padding: {
          left: 'var(--container-padding)',
          right: !isAuto && n % 1 > 0
            ? `calc(var(--container-padding) + ${Math.round((n % 1) * 100)}%)`
            : 'var(--container-padding)',
        },
      };
    };

    const splide = new Splide(el, {
      drag: 'isOverflow',
      snap: true,
      flickPower: 400,
      arrows: false,
      pagination: false,
      autoWidth: isAuto,
      mediaQuery: 'min',
      ...buildBp('xs'),
      breakpoints: {
        576:  buildBp('sm'),
        768:  buildBp('md'),
        992:  buildBp('lg'),
        1200: buildBp('xl'),
        1400: buildBp('xxl'),
      },
    }).mount();

    el._splide = splide;
    // requestAnimationFrame(() => splide.refresh());

    // Splide handles data-splide-go clicks natively.
    // Sync disabled state on custom nav buttons after each move.
    const btnPrev = el.querySelector('[data-splide-go="prev"]');
    const btnNext = el.querySelector('[data-splide-go="next"]');
    if (btnPrev || btnNext) {
      const sync = () => {
        if (btnPrev) btnPrev.disabled = splide.index === 0;
        if (btnNext) btnNext.disabled = splide.index === splide.Components.Controller.getEnd();
      };
      sync();
      splide.on('moved', sync);
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountSplideEls);
} else {
  mountSplideEls();
}
