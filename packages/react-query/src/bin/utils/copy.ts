import fs from 'node:fs'
import { join, resolve } from 'node:path'

const dir = resolve(__dirname, '..')

export function copy(version: number) {
  const files = fs.readdirSync(dir)

  if (files.length === 0) {
    return false
  }

  for (const file of files) {
    if (file.includes(`v${version}`)) {
      const src = join(dir, file)
      const dest = join(dir, file.replace(`v${version}`, 'index'))
      const content = fs.readFileSync(src, 'utf-8')

      try {
        fs.unlinkSync(dest)
      } catch {
        /* empty */
      }
      fs.writeFileSync(dest, content, 'utf-8')
    }
  }

  return true
}
