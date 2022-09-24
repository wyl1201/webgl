// vite.config.js
import { readdirSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'

function getInput(dir) {
  return readdirSync(resolve(__dirname, dir)).reduce((pages, page) => {
    pages[page] = resolve(__dirname, `${dir}/${page}/index.html`)
    return pages
  }, {})
}

console.log(getInput('three'))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...getInput('pages'),
        ...getInput('three')
      }
    }
  }
})
