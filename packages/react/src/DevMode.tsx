import { DevelopmentDevMode, ProductionDevMode } from './contexts/SuspensiveDevModeContext'

/**
 * @experimental This is experimental feature.
 */
export const DevMode: typeof DevelopmentDevMode | typeof ProductionDevMode =
  process.env.NODE_ENV === 'development' ? DevelopmentDevMode : ProductionDevMode
