# pagebuilderSplide

A lightweight Splide.js wrapper for page builder environments. Configure responsive sliders entirely through HTML `data-` attributes — no per-slider JavaScript required.

## Dependencies

Loaded via CDN (no install needed):

- [Splide 4.1.4](https://splidejs.com/)
- [Bootstrap 5.3](https://getbootstrap.com/) — layout utilities only
- [Font Awesome 6.5](https://fontawesome.com/) — nav button icons (optional)

## Files

| File           | Purpose                                                  |
|----------------|----------------------------------------------------------|
| `initiate.js`  | Initialisation, data attribute → CSS custom property bridge |
| `styles.css`   | Track width, slide width, gap, and button layout         |

## Basic Usage

Add `data-slider="ready"` to any `.splide` element. The script picks it up automatically on `DOMContentLoaded`.

```html
<div class="splide" data-slider="ready" data-items="1.2" data-items-md="3" data-gap="1rem">
  <div class="splide__track">
    <ul class="splide__list">
      <li class="splide__slide">…</li>
      <li class="splide__slide">…</li>
    </ul>
  </div>
</div>
```

## Data Attributes

### Items per breakpoint

Controls how many slides are visible at each breakpoint. Values cascade upward — set only the breakpoints you need.

| Attribute        | Breakpoint    |
|------------------|---------------|
| `data-items`     | xs (default)  |
| `data-items-sm`  | ≥ 576px       |
| `data-items-md`  | ≥ 768px       |
| `data-items-lg`  | ≥ 992px       |
| `data-items-xl`  | ≥ 1200px      |
| `data-items-xxl` | ≥ 1400px      |

Set to a decimal (e.g. `1.2`) to reveal a partial peek of the next slide. Set to `"auto"` to size slides by their content width.

### Gap per breakpoint

Same breakpoint suffix pattern as items: `data-gap`, `data-gap-sm`, …, `data-gap-xxl`. Accepts any CSS length (`1rem`, `16px`, etc.). Defaults to `1rem` if omitted.

### Other attributes

| Attribute                         | Description                                                              |
|-----------------------------------|--------------------------------------------------------------------------|
| `data-center-when-fit="true"`     | Centres slides when all fit in the viewport without overflow             |
| `data-restructure-columns="true"` | Reorders slides by Bootstrap `order-N` classes before the slider mounts |
| `data-max-width`                  | Extends the full-bleed track cap to `1600`, `2400`, or `3200`px         |

## Layout Modes

**Full-bleed (default):** Place `.splide` outside a `.container`. The track extends to the viewport edge, with padding calculated to align slide content to the Bootstrap grid column.

**Contained:** Place `.splide` inside a `.container`. The track automatically constrains to the container width — no extra attribute needed.

## Slide Reordering

When `data-restructure-columns="true"` is set, slides are reordered before Splide mounts:

1. Slides with a Bootstrap `order-N` class are sorted numerically and moved to the front.
2. Remaining slides follow in their original DOM order.
3. `order-N` classes are stripped from slides after reordering.
4. Slides with `class="d-none"` or `data-display="hide"` are removed from the DOM entirely.

This is useful when page builder column ordering differs between mobile and desktop and you want the slider's DOM order to reflect a specific sequence.

## Nav Buttons

Place a `.splideButtons` div inside `.splide` with `data-splide-go` buttons:

```html
<div class="splideButtons">
  <button data-splide-go="prev" aria-label="Previous">
    <i class="fa-solid fa-arrow-left"></i>
  </button>
  <button data-splide-go="next" aria-label="Next">
    <i class="fa-solid fa-arrow-right"></i>
  </button>
</div>
```

Behaviour:
- The button group is hidden automatically when the slider has no overflow (all slides fit).
- The `prev` button is disabled on the first slide; `next` is disabled on the last.

## JavaScript API

The script exposes two globals for programmatic use:

**`window._mountSplideEl(element)`** — Mount a single `.splide` element. Useful for sliders injected into the DOM after page load.

**`window._splideInstances`** — Array of all mounted Splide instances, in mount order.

Each mounted element also stores its instance at `element.splideInstance` and sets `data-slider-status="mounted"` once ready.

## Splide Options

The following Splide options are set by the wrapper and are not configurable via data attributes:

| Option        | Value   | Reason                                        |
|---------------|---------|-----------------------------------------------|
| `drag`        | `free`  | Enables free-scroll drag behaviour            |
| `snap`        | `true`  | Snaps to the nearest slide after free drag    |
| `flickPower`  | `300`   | Controls flick sensitivity                    |
| `arrows`      | `false` | Custom `.splideButtons` are used instead      |
| `pagination`  | `false` | Disabled by default                           |
| `autoWidth`   | `true`  | Slide widths are set via CSS custom properties |
| `gap`         | `0`     | Gap is applied via CSS, not Splide internals  |

Padding is automatically calculated to align track content with the Bootstrap grid.
