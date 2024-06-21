import { switchVersion } from './utils.js'

const version = process.argv[2]

if (version === '4') {
  switchVersion(4)
} else if (version === '5') {
  switchVersion(5)
} else {
  console.warn('[@suspensive/react-query],', `expecting version "4" or "5""`)
  process.exit(1)
}
