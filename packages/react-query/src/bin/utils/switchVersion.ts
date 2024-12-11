import { copy } from './copy'
import { logger } from './logger'

export function switchVersion(version: number) {
  const result = copy(version)

  if (result) {
    logger.log(`switched to version v${version}`)
  } else {
    logger.error('not found version files.')
  }
}
