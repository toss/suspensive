import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

type TanStackMajor = 4 | 5

const DEFAULT_VERSION: TanStackMajor = 5

let cachedVersion: TanStackMajor | undefined

export function resetTanStackVersionCache(): void {
  cachedVersion = undefined
}

export function detectTanStackVersion(startDir: string = process.cwd()): TanStackMajor {
  const override = process.env.SUSPENSIVE_RQ_TARGET
  if (override === '4' || override === '5') {
    return Number(override) as TanStackMajor
  }

  if (cachedVersion !== undefined) {
    return cachedVersion
  }

  const range = findTanStackRange(startDir)
  if (range === undefined) {
    console.warn(
      `[migrate-suspensive-react-query-package] Could not detect @tanstack/react-query version from package.json. Defaulting to v${DEFAULT_VERSION}.`
    )
    cachedVersion = DEFAULT_VERSION
    return cachedVersion
  }

  const major = parseMajor(range)
  if (major === undefined) {
    console.warn(
      `[migrate-suspensive-react-query-package] Could not parse major version from @tanstack/react-query range "${range}". Defaulting to v${DEFAULT_VERSION}.`
    )
    cachedVersion = DEFAULT_VERSION
    return cachedVersion
  }

  cachedVersion = major
  return cachedVersion
}

function findTanStackRange(startDir: string): string | undefined {
  let current = startDir
  let parent = dirname(current)
  while (parent !== current) {
    const pkgPath = join(current, 'package.json')
    if (existsSync(pkgPath)) {
      try {
        const raw = readFileSync(pkgPath, 'utf8')
        const pkg = JSON.parse(raw) as {
          dependencies?: Record<string, string | undefined>
          devDependencies?: Record<string, string | undefined>
          peerDependencies?: Record<string, string | undefined>
        }
        const range =
          pkg.dependencies?.['@tanstack/react-query'] ??
          pkg.devDependencies?.['@tanstack/react-query'] ??
          pkg.peerDependencies?.['@tanstack/react-query']
        if (range) {
          return range
        }
      } catch {
        // ignore and continue walking up
      }
    }

    current = parent
    parent = dirname(current)
  }
  return undefined
}

function parseMajor(range: string): TanStackMajor | undefined {
  const match = /(\d+)/.exec(range)
  if (!match) {
    return undefined
  }
  const n = Number(match[1])
  if (n === 4 || n === 5) {
    return n
  }
  return undefined
}
