import fs from 'fs'
import { extname, join, resolve } from 'path'

const __dirname = process.cwd()

const dir = resolve(__dirname, '..')

export function copy(version: number): void {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    if (file.startsWith(`v${version}`)) {
      const src = join(dir, file)
      const ext = extname(file)
      const dest = join(dir, `index${ext}`)
      const content = fs.readFileSync(src, 'utf-8')

      try {
        fs.unlinkSync(dest)
      } catch (e) {
        /* empty */
      }
      fs.writeFileSync(dest, content, 'utf-8')
    }
  })
}
