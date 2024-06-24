import fs from 'fs'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dir = resolve(__dirname, '..', 'dist')

export function copy(version: number): void {
  const srcDir = join(dir, `v${version}`)
  const files = fs.readdirSync(srcDir)

  files.forEach((file) => {
    const src = join(srcDir, file)
    const dest = join(dir, file)
    const content = fs.readFileSync(src, 'utf-8')

    try {
      fs.unlinkSync(dest)
    } catch (e) {
      /* empty */
    }
    fs.writeFileSync(dest, content, 'utf-8')
  })
}
