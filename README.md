# Splide Utility

A thin wrapper around [Splide JS](https://splidejs.com/) that aligns sliders with Bootstrap 5 container widths and adds responsive item counts, peek, and auto-width modes via HTML data attributes.

## Dependencies

Add these alongside your existing Bootstrap includes:

```html
<!-- Splide core CSS (in <head>) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide-core.min.css">
<link rel="stylesheet" href="splide.css">

<!-- Splide JS + this utility (before </body>) -->
<script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
<script src="splide.js"></script>
```


## Basic usage

```html
<div class="splide" data-slider="initial" data-items="1.2" data-items-md="3" data-gap="1rem">
  <div class="splide__track">
    <ul class="splide__list">
      <li class="splide__slide">…</li>
      <li class="splide__slide">…</li>
    </ul>
  </div>
</div>
```

`data-slider="initial"` is the trigger. The script sets it to `ready` after mounting. The Splide instance is stored on `element._splide`.


## Data attributes

### Item count — `data-items`

Sets how many slides are visible at a time. Supports decimals for peek (the fractional part becomes right padding, revealing the next slide).

| Attribute | Breakpoint |
|---|---|
| `data-items` | Base (xs, all sizes) |
| `data-items-sm` | ≥ 576px |
| `data-items-md` | ≥ 768px |
| `data-items-lg` | ≥ 992px |
| `data-items-xl` | ≥ 1200px |
| `data-items-xxl` | ≥ 1400px |

Values cascade — only set the breakpoints you need. `data-items="1.2"` shows one slide plus 20% of the next.

```html
data-items="1.2" data-items-sm="2.2" data-items-md="3"
```

### Gap — `data-gap`

Gap between slides. Accepts any CSS length value. Supports the same per-breakpoint suffixes as `data-items`.

```html
data-gap="1rem"
data-gap="1rem" data-gap-lg="1.5rem"
```

### Auto-width items — `data-items="auto"`

Slides take their natural content width (useful for filter chips, tags, etc.). Incompatible with `data-items` counts.

```html
data-items="auto"
```

### Layout mode — `data-mode`

| Value | Behaviour |
|---|---|
| *(omitted)* | **Full-bleed** — slider spans the viewport; track edges align with the Bootstrap container at each breakpoint |
| `contained` | **Contained** — slider sits inside a `.container`; padding defaults to Bootstrap's gutter (0.75rem) |

```html
<!-- Full-bleed (default) -->
<div class="splide" data-slider="initial" …>

<!-- Contained -->
<div class="splide" data-slider="initial" data-mode="contained" …>
```

Override padding in contained mode via CSS:
```css
#my-slider { --container-padding: 2rem; }
```

### Centre when all items fit — `data-center-when-fit`

When the slider doesn't overflow (all slides are visible), the list is centred. Useful with `data-items="auto"`.

```html
data-items="auto" data-center-when-fit
```

### Column reorder — `data-restructure-columns="true"`

Before mounting, slides with Bootstrap `order-N` classes are sorted into that order and the classes are removed. Slides with `d-none` or `data-display="hide"` are removed from the DOM.

```html
<div class="splide" data-slider="initial" data-restructure-columns="true" …>
  <ul class="splide__list">
    <li class="splide__slide order-2">…</li>
    <li class="splide__slide order-1">…</li>
  </ul>
</div>
```


## Navigation buttons

Place a `.splideButtons` container inside the `.splide` element. Buttons are automatically wired up and disabled at the start/end of the track. The container is hidden when all slides fit without scrolling.

```html
<div class="splide" data-slider="initial" …>
  <div class="splide__track">…</div>
  <div class="splideButtons">
    <button data-splide-go="prev" aria-label="Previous">←</button>
    <button data-splide-go="next" aria-label="Next">→</button>
  </div>
</div>
```

When placed as a **direct child of `.splide`** (after the track), button padding aligns with the container edge automatically.


## CSS custom properties

Override these on your element to adjust layout:

| Property | Default | Description |
|---|---|---|
| `--container-padding` | *computed* | Left/right padding applied to the track. In full-bleed mode this is calculated from `--container-width-content`. In contained mode it defaults to `--default-padding`. |
| `--default-padding` | `0.75rem` | Minimum padding and contained-mode default. |
| `--container-width-content` | *per breakpoint* | Width of Bootstrap's content area at each breakpoint. Override if using a non-standard container. |
