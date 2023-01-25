import fse from 'fs-extra'
import globby from 'globby'
import path from 'path'
import { DOCUSAURUS_ROOT, PACKAGES_ROOT } from './constants'

const EN_OUTDIR = path.resolve(DOCUSAURUS_ROOT, 'docs')
const KO_OUTDIR = path.resolve(DOCUSAURUS_ROOT, 'i18n/ko/docusaurus-plugin-content-docs/current')

const excludes = ['**/*.en.md', '**/*.ko.md', '**/README.md', '**/CHANGELOG.md', '**/node_modules']
export async function generateDocsFromMD() {
  return await Promise.all([
    copyMDDocs(PACKAGES_ROOT, EN_OUTDIR, excludes),
    copyMDDocs(path.join(DOCUSAURUS_ROOT, 'intro'), path.join(EN_OUTDIR, 'intro'), excludes),

    generateLanguageDocs(PACKAGES_ROOT, 'en', EN_OUTDIR),
    generateLanguageDocs(PACKAGES_ROOT, 'ko', KO_OUTDIR),

    generateLanguageDocs(path.join(DOCUSAURUS_ROOT, 'intro'), 'en', path.join(EN_OUTDIR, 'intro')),
    generateLanguageDocs(path.join(DOCUSAURUS_ROOT, 'intro'), 'ko', path.join(KO_OUTDIR, 'intro')),

    generateDefaultREADMEDocs(EN_OUTDIR),
    generateI18nREADMEDocs('ko', KO_OUTDIR),
  ])
}

async function copyMDDocs(cwd: string, outdir: string, excludes: string[]) {
  const filepaths = await globby([`**/*.md`, '**/*_category_.json'], {
    cwd,
    ignore: excludes,
  })

  await Promise.all(
    filepaths.map(async (filepath) => {
      const source = path.join(cwd, filepath)
      const destination = path.join(outdir, filepath)

      await fse.ensureDir(path.dirname(destination))
      await fse.copy(source, destination)
    })
  )
}

async function generateLanguageDocs(cwd: string, lang: string, outdir: string) {
  const filepaths = await globby(`**/*.${lang}.{md,mdx}`, {
    cwd,
    ignore: [`**/README.${lang}.md`, `**/node_modules`],
  })

  await Promise.all(
    filepaths.map(async (filepath) => {
      const source = path.join(cwd, filepath)
      const destination = path.join(outdir, filepath).replace(new RegExp(`\\.${lang}\\.`), '.i18n.')

      await fse.ensureDir(path.dirname(destination))
      await fse.copy(source, destination)
    })
  )
}

async function generateDefaultREADMEDocs(outdir: string) {
  const filepaths = await globby(`**/README.md`, {
    cwd: PACKAGES_ROOT,
    ignore: [`**/node_modules`],
  })

  await Promise.all(
    filepaths.map(async (filepath) => {
      console.log(`Generating docs from README: ${filepath}`)

      const source = path.join(PACKAGES_ROOT, filepath)
      const destination = path.join(outdir, filepath).replace('/README.', '/README.i18n.')

      await fse.ensureDir(path.dirname(destination))
      await fse.copy(source, destination)
    })
  )
}

async function generateI18nREADMEDocs(lang: string, outdir: string) {
  const filepaths = await globby(`**/README.${lang}.md`, {
    cwd: PACKAGES_ROOT,
    ignore: [`**/node_modules`],
  })

  await Promise.all(
    filepaths.map(async (filepath) => {
      console.log(`Generating docs from README: ${filepath}`)

      const source = path.join(PACKAGES_ROOT, filepath)
      const destination = path.join(outdir, filepath).replace(new RegExp(`\\.${lang}\\.`), '.i18n.')

      await fse.ensureDir(path.dirname(destination))
      await fse.copy(source, destination)
    })
  )
}
