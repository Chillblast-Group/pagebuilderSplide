# SplideBasic

A lightweight wrapper around [Splide.js](https://splidejs.com/) that drives responsive sliders entirely through HTML `data-` attributes and CSS custom properties — no per-slider JS configuration required.

## Dependencies

Loaded via CDN (no install needed):

- [Bootstrap 5.3](https://getbootstrap.com/) — layout utilities only
- [Splide 4.1.4](https://splidejs.com/)
- [Font Awesome 6.5](https://fontawesome.com/) — nav button icons
- Google Fonts — Syne + DM Mono

## Usage

Add `data-slider="ready"` to any `.splide` element and configure it with data attributes:

```html
<div class="splide" data-slider="ready" data-items="1.2" data-items-md="3" data-gap="1rem">
  <div class="splide__track">
    <ul class="splide__list">
      <li class="splide__slide">…</li>
    </ul>
  </div>
  <!-- Optional nav buttons -->
  <div class="splideButtons">
    <button data-splide-go="prev" aria-label="Previous"><i class="fa-solid fa-arrow-left"></i></button>
    <button data-splide-go="next" aria-label="Next"><i class="fa-solid fa-arrow-right"></i></button>
  </div>
</div>
```

## Data Attributes

### Items (per-breakpoint, mobile-first)

| Attribute        | Breakpoint   |
|------------------|--------------|
| `data-items`     | xs (default) |
| `data-items-sm`  | ≥ 576px      |
| `data-items-md`  | ≥ 768px      |
| `data-items-lg`  | ≥ 992px      |
| `data-items-xl`  | ≥ 1200px     |
| `data-items-xxl` | ≥ 1400px     |

Set to a decimal (e.g. `1.2`) to show a partial peek of the next slide. Set to `"auto"` to size slides by their content.

### Gap (per-breakpoint, mobile-first)

Same suffix pattern: `data-gap`, `data-gap-sm`, …, `data-gap-xxl`. Accepts any CSS length (`1rem`, `16px`, etc.). Defaults to `1rem`.

### Other

| Attribute                         | Description                                                        |
|-----------------------------------|--------------------------------------------------------------------|
| `data-center-when-fit="true"`     | Centres slides when all fit in the viewport (no overflow)          |
| `data-restructure-columns="true"` | Reorders slides by Bootstrap `order-N` classes before mounting     |

## Modes

**Full-bleed** (default): Place `.splide` outside a `.container`. The track extends to the viewport edges with padding calculated to align content to the Bootstrap grid.

**Contained**: Place `.splide` inside a `.container`. The track is constrained to the container width automatically — no extra attribute needed.

## Slide Reordering (`data-restructure-columns`)

When `data-restructure-columns="true"` is set, slides are reordered before Splide mounts:

1. Slides with a Bootstrap `order-N` class are sorted numerically and placed first.
2. Remaining slides follow in their original DOM order.
3. `order-N` classes are removed from slides after reordering.
4. Slides with `class="d-none"` or `data-display="hide"` are removed from the DOM entirely.

## Nav Buttons

Place a `.splideButtons` div inside the `.splide` element with buttons using `data-splide-go="prev"` / `data-splide-go="next"`. Buttons are hidden automatically when the slider has no overflow. The `prev` button is disabled on the first slide and `next` on the last.

## Files

| File         | Purpose                                         |
|--------------|-------------------------------------------------|
| `splide.js`  | Initialisation, data attribute → CSS var bridge |
| `splide.css` | Track width, slide width, and button layout     |
| `splide.html`| Demo page with four slider examples             |
