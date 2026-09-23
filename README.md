# wp-html-template

Vite analog of [laravel-mix-front-only](../laravel-mix-front-only): HTML prototyping with layouts/partials, then ship `assets/` inside a WordPress theme.

## Setup

```bash
npm install
```

| Command | What it does |
| --- | --- |
| `npm run dev:html` | HTML localhost server (HMR) |
| `npm run build:html` | HTML prod → `assets/` + root `*.html` |
| `npm run dev:wp` | WP watch → rebuild `assets/` on change (no server; use your WP site) |
| `npm run build:wp` | WP prod → minified `assets/` only |

WordPress workflow: run `dev:wp` while editing, browse the local WP site; ship with `build:wp`.


## Conditional modules (tree-shaking)

Global bundle is small (`app` + `style.css`). Features are separate entries — only requested ones download.

**HTML** — comment at top of the page:

```html
<!-- modules: accordion,modals,drawers,tabs -->
<extends src="layout.html">
  <block name="content">…</block>
</extends>
```

Built `index.html` / `page-2.html` get only those `<link>` / `<script type="module">` tags.

UI for accordion / modal / drawer / tabs is **Bootstrap** (data attributes only — no custom JS). Slider stays Swiper.

**WordPress**:

```php
require_once get_template_directory() . '/wordpress/enqueue-assets.php';
add_action( 'wp_enqueue_scripts', function () {
    $modules = array();
    if ( is_front_page() ) {
        $modules[] = 'slider';
    }
    if ( is_page( 'pricing' ) ) {
        $modules = array_merge( $modules, array( 'accordion', 'tabs' ) );
    }
    wp_html_template_enqueue_assets( $modules );
} );
```

| Module | Source | JS | CSS |
| --- | --- | --- | --- |
| *(always)* | site chrome | `js/app.js` | `css/style.css` |
| `accordion` | Bootstrap Collapse | `js/accordion.js` | `css/accordion.css` |
| `modals` | Bootstrap Modal | `js/modals.js` | `css/modals.css` |
| `drawers` | Bootstrap Offcanvas | `js/drawers.js` | `css/drawers.css` |
| `tabs` | Bootstrap Tab | `js/tabs.js` | `css/tabs.css` |
| `slider` | Swiper | `js/slider.js` | `css/slider.css` |

Add a module: create `resources/js/modules/foo.js` (+ optional `resources/sass/modules/foo.scss`), register the name in `MODULES` inside `vite.config.js`, and pass `'foo'` from HTML/PHP.


### Browser coverage

Scripts use `type="module"` with `build.target: 'es2018'` — supported by all current browsers (Chrome 61+, Safari 12+, Firefox 60+, no IE11). That is effectively full coverage of active traffic.

If you still need ancient browsers, add [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) and enqueue the generated `-legacy` / polyfill scripts with `nomodule`.

## Lint / IDE

```bash
npm run lint        # ESLint + Stylelint
npm run lint:fix   # auto-fix what can be fixed
```

Install the recommended VS Code/Cursor extensions when prompted (`ESLint`, `Stylelint`). Workspace settings enable squiggles and fix-on-save for JS; Stylelint validates SCSS (built-in CSS validation is off to avoid duplicate warnings).

## Layout

```
resources/
  html/           pages + layouts/ + partials/
  js/app.js       global
  js/modules/     conditional entries
  js/utils/       feature implementations
  sass/style.scss global styles
  sass/modules/   CSS loaded only with that JS entry
assets/           build output
wordpress/        conditional enqueue helper
```

## HTML templating

```html
<!-- modules: accordion -->
<extends src="layout.html">
  <block name="content">
    <main class="main"></main>
  </block>
</extends>
```

Partials: `<include src="header.html">` from `resources/html/partials/`.
