import { copy } from './copy'

export function switchVersion(version: number): void {
  copy(version)
  console.log('[@suspensive/react-query]', `set version to v${version}`)
}
