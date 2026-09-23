import { existsSync } from 'node:fs'

const required = [
  'assets/js/app.js',
  'assets/css/style.css',
  'assets/js/accordion.js',
  'assets/css/accordion.css',
  'assets/js/slider.js',
  'assets/css/slider.css',
  'assets/js/modals.js',
  'assets/js/tabs.js',
]

let failed = false
for (const file of required) {
  if (!existsSync(file)) {
    console.error(`missing: ${file}`)
    failed = true
  }
}

if (failed) process.exit(1)
console.log('ok: wp assets')
