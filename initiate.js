const restructureColumns = function(containerEl, containerSelector, itemSelector) {
  itemSelector = itemSelector || '.splide__slide';

  // Resolve containerEl to the actual container element
  if (!containerEl.matches(containerSelector)) {
    containerEl = containerEl.querySelector(containerSelector);
  }

  if (!containerEl) return;

  const colEls = Array.from(containerEl.querySelectorAll(itemSelector));

  const ordered = [];
  const unordered = [];

  colEls.forEach(col => {
    // Drop hidden slides completely
    if (col.classList.contains('d-none')) {
      col.remove();
      return;
    }

    // Only care about classes like "order-1", "order-2", etc.
    const orderClass = Array.from(col.classList).find(c =>
      /^order-\d+$/.test(c)
    );

    if (orderClass) {
      const orderNum = parseInt(orderClass.split('-')[1], 10);
      if (!Number.isNaN(orderNum)) {
        ordered.push({ el: col, order: orderNum });
      } else {
        unordered.push(col);
      }

      // Remove *all* order-* classes now
      Array.from(col.classList)
        .filter(c => c.startsWith('order-'))
        .forEach(c => col.classList.remove(c));
    } else {
      unordered.push(col);
    }
  });

  ordered.sort((a, b) => a.order - b.order);

  const finalOrder = [...ordered.map(o => o.el), ...unordered];

  finalOrder.forEach(el => containerEl.appendChild(el));
};


const mountSplideEls = function() {
    
      // Find all slider groups on the page
      const sliderGroups = document.querySelectorAll('.splide[data-splide-status="initial"]');
      if(!sliderGroups) {
          return false;
      }
    
      sliderGroups.forEach(splideElement => {
          
        splideElement.dataset.splideStatus = "done"

        if (splideElement.dataset && splideElement.dataset.restructureColumns) {
          restructureColumns(splideElement, '.splide__list');
        }
        
        // 2. Find the specific buttons within THIS group
        const btnNext = splideElement.querySelector('button[data-splide-go="next"]');
        const btnPrev = splideElement.querySelector('button[data-splide-go="prev"]');
        
        // Items
        const itemsDefault = 1
        const itemsXs = splideElement.dataset.itemsXs || itemsDefault
        const itemsSm = splideElement.dataset.itemsSm || itemsXs
        const itemsMd = splideElement.dataset.itemsMd || itemsSm
        const itemsLg = splideElement.dataset.itemsLg || itemsMd
        const itemsXl = splideElement.dataset.itemsXl || itemsLg
        const itemsXxl = splideElement.dataset.itemsXxl || itemsXl
        
        const gapDefault = splideElement.dataset.gap
        const gapXs = splideElement.dataset.gapXs || gapDefault
        const gapSm = splideElement.dataset.gapSm || gapXs
        const gapMd = splideElement.dataset.gapMd || gapSm
        const gapLg = splideElement.dataset.gapLg || gapMd
        const gapXl = splideElement.dataset.gapXl || gapLg
        const gapXxl = splideElement.dataset.gapXxl || gapXl
        
        const padding = function(items) {
            const itemsFloor = Math.floor(items)
            const decimal = items - itemsFloor
            let paddingRight = 'var(--container-padding)'
            if (decimal && decimal > 0) {
                const decimalAsPercentage = decimal * 100
                const decimalAsPercentageRounded = Math.round(decimalAsPercentage)
                paddingRight = 'calc(var(--container-padding) + ' + decimalAsPercentageRounded + '%)'
            }
            return { 
                left: 'var(--container-padding)', 
                right: paddingRight
              }
        }
    
        // 3. Initialize this specific Splide instance
        const splide = new Splide(splideElement, {
          drag: 'free',               // <— this is the big one
          snap: true,                 // keeps it snapping to the nearest slide after you let go
          flickPower: 800,  
          arrows: false,
          pagination: false,
          padding: { 
              left: 'var(--container-padding)', 
              right: 'var(--container-padding)'
            },
          mediaQuery: 'min',
          gap: gapXs,
          // perPage: Math.floor(itemsXs),
          autoWidth: true,
          breakpoints: {
            576: { 
              // perPage: Math.floor(itemsSm),
              gap: gapSm,
              // padding: padding(itemsSm)
            },
            768: { 
              //perPage: Math.floor(itemsMd),
              gap: gapMd,
              //padding: padding(itemsMd)
            },
            992: { 
              //perPage: Math.floor(itemsLg),
              gap: gapLg,
              //padding: padding(itemsLg)
            },
            1200: { 
              //perPage: Math.floor(itemsXl),
              gap: gapXl,
              //padding: padding(itemsXl)
            },
            1400: { 
              //perPage: Math.floor(itemsXxl),
              gap: gapXxl,
              //padding: padding(itemsXxl)
            }
          }
        }).mount();
        
        
        
        // Scroll listeners
        if (btnNext) btnNext.addEventListener('click', () => splide.go('+1'));
        if (btnPrev) btnPrev.addEventListener('click', () => splide.go('-1'));
        const updateButtons = () => {
          if (btnPrev) btnPrev.disabled = splide.index === 0;
          if (btnNext) btnNext.disabled =
            splide.index === splide.Components.Controller.getEnd();
        };
        updateButtons();
        splide.on('moved', updateButtons);
        splide.on('scrolled', updateButtons);

      });
    
};
// If DOM is still loading, wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountSplideEls);
} else {
    mountSplideEls();
}
