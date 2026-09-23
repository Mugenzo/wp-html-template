import { existsSync, readFileSync } from 'node:fs'

const required = [
  'assets/js/app.js',
  'assets/css/style.css',
  'assets/js/accordion.js',
  'assets/css/accordion.css',
  'assets/js/modals.js',
  'assets/css/modals.css',
  'assets/js/drawers.js',
  'assets/css/drawers.css',
  'assets/js/tabs.js',
  'assets/css/tabs.css',
  'assets/js/dropdown.js',
  'assets/css/dropdown.css',
  'assets/js/slider.js',
  'assets/css/slider.css',
  'index.html',
  'page-2.html',
]

let failed = false
for (const file of required) {
  if (!existsSync(file)) {
    console.error(`missing: ${file}`)
    failed = true
  }
}

const index = readFileSync('index.html', 'utf8')
const page2 = readFileSync('page-2.html', 'utf8')

if (!index.includes('/assets/js/accordion.js')) {
  console.error('index.html should load accordion module')
  failed = true
}
if (!index.includes('/assets/css/accordion.css')) {
  console.error('index.html should load accordion.css')
  failed = true
}
if (index.includes('/assets/css/bootstrap.css')) {
  console.error('index.html should not load full bootstrap.css')
  failed = true
}
if (page2.includes('/assets/js/accordion.js')) {
  console.error('page-2.html should not load accordion module')
  failed = true
}

if (failed) process.exit(1)
console.log('ok: conditional modules + assets')
