/**
 * Vite plugin — walks `public/photos/` and exposes a JSON index at
 * `/__photos.json`. Used by tools/Gallery.jsx.
 *
 * Dev: served via middleware (live, reflects current filesystem).
 * Build: emitted as a static asset so the same path resolves in production.
 */

import { readdirSync, statSync } from 'node:fs'
import { join, relative, sep, posix } from 'node:path'

const IMG_RE = /\.(jpe?g|png|webp|avif|gif)$/i

function walkImages(dir, publicRoot) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry)
    const stat = statSync(abs)
    if (stat.isDirectory()) {
      out.push(...walkImages(abs, publicRoot))
    } else if (IMG_RE.test(entry)) {
      const rel = relative(publicRoot, abs).split(sep).join(posix.sep)
      out.push('/' + rel)
    }
  }
  return out
}

function buildIndex(publicRoot, photosDir) {
  let entries = []
  try {
    entries = readdirSync(photosDir)
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }

  const groups = []
  const loose = []

  for (const entry of entries) {
    const abs = join(photosDir, entry)
    const stat = statSync(abs)
    if (stat.isDirectory()) {
      const files = walkImages(abs, publicRoot).sort()
      groups.push({ name: entry, count: files.length, files })
    } else if (IMG_RE.test(entry)) {
      const rel = relative(publicRoot, abs).split(sep).join(posix.sep)
      loose.push('/' + rel)
    }
  }

  groups.sort((a, b) => a.name.localeCompare(b.name))
  if (loose.length) {
    groups.unshift({ name: '(root)', count: loose.length, files: loose.sort() })
  }

  return { groups }
}

export function photoIndexPlugin({
  publicRoot = 'public',
  photosDir = 'public/photos',
  endpoint = '/__photos.json',
} = {}) {
  const fileName = endpoint.replace(/^\//, '')
  return {
    name: 'kol-framework-photo-index',
    configureServer(server) {
      server.middlewares.use(endpoint, (req, res) => {
        try {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify(buildIndex(publicRoot, photosDir)))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName,
        source: JSON.stringify(buildIndex(publicRoot, photosDir)),
      })
    },
  }
}
