import { existsSync } from 'node:fs'

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
]

let failed = false
for (const file of required) {
  if (!existsSync(file)) {
    console.error(`missing: ${file}`)
    failed = true
  }
}

if (existsSync('assets/css/bootstrap.css')) {
  console.error('unexpected full bootstrap.css — components should be split')
  failed = true
}

if (failed) process.exit(1)
console.log('ok: wp assets')
