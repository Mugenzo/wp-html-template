import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import fullReload from 'vite-plugin-full-reload'
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs'
import { resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import posthtml from 'posthtml'
import posthtmlExtend from 'posthtml-extend'
import posthtmlInclude from 'posthtml-include'

const root = fileURLToPath(new URL('.', import.meta.url))
const htmlDir = resolve(root, 'resources/html')
const layoutsDir = resolve(htmlDir, 'layouts')
const partialsDir = resolve(htmlDir, 'partials')

/** Known conditional entries (built always; loaded only when requested). */
export const MODULES = ['accordion', 'modals', 'drawers', 'tabs', 'slider']

/** Modules that emit a CSS file (skip empty <link> tags for the rest). */
const MODULES_WITH_CSS = new Set(['accordion', 'modals', 'drawers', 'tabs', 'slider'])

const entries = {
  app: resolve(root, 'resources/js/app.js'),
  ...Object.fromEntries(
    MODULES.map((name) => [name, resolve(root, `resources/js/modules/${name}.js`)]),
  ),
}

async function renderHtml(source) {
  const { html } = await posthtml([
    posthtmlExtend({ root: layoutsDir }),
    posthtmlInclude({ root: partialsDir }),
  ]).process(source)
  return html
}

function extractModules(source) {
  const match = source.match(/<!--\s*modules:\s*([^\n*]+?)\s*-->/i)
  if (!match) return []
  return match[1]
    .split(',')
    .map((s) => s.trim())
    .filter((name) => MODULES.includes(name))
}

function listPageHtml() {
  return readdirSync(htmlDir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => resolve(htmlDir, f))
}

function injectModules(html, modules, { dev }) {
  const css = modules
    .filter((name) => MODULES_WITH_CSS.has(name))
    .map((name) =>
      dev
        ? '' // CSS arrives via each module's JS import in dev
        : `<link rel="stylesheet" href="/assets/css/${name}.css">`,
    )
    .filter(Boolean)
    .join('\n    ')

  const js = modules
    .map((name) =>
      dev
        ? `<script type="module" src="/resources/js/modules/${name}.js"></script>`
        : `<script type="module" src="/assets/js/${name}.js"></script>`,
    )
    .join('\n')

  return html
    .replace(
      /<link\s+rel="stylesheet"\s+href="\/assets\/css\/style\.css"\s*\/?>/i,
      dev
        ? '' // global CSS via app.js import
        : `<link rel="stylesheet" href="/assets/css/style.css">${css ? `\n    ${css}` : ''}`,
    )
    .replace(
      /<script\s+src="\/assets\/js\/app\.js"><\/script>/i,
      dev
        ? `<script type="module" src="/resources/js/app.js"></script>${js ? `\n${js}` : ''}`
        : `<script type="module" src="/assets/js/app.js"></script>${js ? `\n${js}` : ''}`,
    )
}

/**
 * HTML local server (dev:html) + emit root *.html on build:html.
 * Skipped for WordPress modes (PHP enqueues assets/).
 */
function htmlBuilder({ emitHtml }) {
  return {
    name: 'html-builder',
    configureServer(server) {
      // Stale build:html output at project root fights Vite's own HTML reload rules.
      for (const name of readdirSync(root)) {
        if (!name.endsWith('.html')) continue
        try {
          unlinkSync(resolve(root, name))
        } catch {
          // ignore
        }
      }

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] || ''
        const map = {
          '/': '/index.html',
          '/index.html': '/index.html',
        }
        // `/page-2.html` contains a slash — only reject nested paths like `/foo/bar.html`
        const page =
          map[url] || (/^\/[^/]+\.html$/.test(url) ? url : null)
        if (!page) return next()

        const file = resolve(htmlDir, basename(page))
        if (!existsSync(file)) return next()

        try {
          const source = readFileSync(file, 'utf8')
          const modules = extractModules(source)
          let html = injectModules(await renderHtml(source), modules, { dev: true })
          html = await server.transformIndexHtml(url === '/' ? '/' : page, html)
          res.setHeader('Content-Type', 'text/html')
          res.setHeader('Cache-Control', 'no-store')
          res.end(html)
        } catch (err) {
          next(err)
        }
      })
    },
    async writeBundle() {
      if (!emitHtml) return
      mkdirSync(root, { recursive: true })
      for (const file of listPageHtml()) {
        const source = readFileSync(file, 'utf8')
        const modules = extractModules(source)
        const html = injectModules(await renderHtml(source), modules, { dev: false })
        writeFileSync(resolve(root, basename(file)), html)
      }
    },
  }
}

/**
 * Modes:
 * - development (vite serve) → HTML localhost
 * - html → HTML prod (assets + root *.html)
 * - wp-dev → WP watch to disk (no minify, sourcemaps, no HTML, no server)
 * - wp → WP prod (minified assets only)
 */
export default defineConfig(({ mode }) => {
  const isWpDev = mode === 'wp-dev'
  const isProdBuild = mode === 'html' || mode === 'wp'

  return {
    // We serve HTML ourselves from resources/html (Mix-style layouts/partials).
    appType: 'custom',
    plugins: [
      htmlBuilder({ emitHtml: mode === 'html' }),
      // Vite only reloads when changed *.html === open URL; force reload for partials.
      fullReload(['resources/html/**/*.html'], { delay: 50 }),
      viteStaticCopy({
        targets: [
          { src: 'resources/images/**/*', dest: 'images' },
          { src: 'resources/fonts/**/*', dest: 'fonts' },
          { src: 'resources/uploads/**/*', dest: 'uploads' },
        ],
      }),
    ],
    build: {
      target: 'es2018',
      modulePreload: false,
      outDir: 'assets',
      emptyOutDir: true,
      manifest: true,
      cssCodeSplit: true,
      minify: isProdBuild,
      sourcemap: isWpDev,
      rollupOptions: {
        input: entries,
        output: {
          entryFileNames: 'js/[name].js',
          chunkFileNames: 'js/chunks/[name]-[hash].js',
          assetFileNames: ({ name }) => {
            if (name && name.endsWith('.css')) {
              const base = name.replace(/\.css$/i, '')
              if (base === 'app' || base === 'style') return 'css/style.css'
              return `css/${base}.css`
            }
            if (name && /\.(woff2?|ttf|otf|eot)$/.test(name)) return 'fonts/[name][extname]'
            if (name && /\.(png|jpe?g|gif|svg|webp|avif)$/.test(name)) {
              return 'images/[name][extname]'
            }
            return '[name][extname]'
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    server: {
      strictPort: true,
      open: '/',
      watch: {
        disableGlobbing: false,
      },
    },
  }
})
