import { DevelopmentDevMode, ProductionDevMode } from './contexts/SuspensiveDevModeContext'

export const DevMode: typeof DevelopmentDevMode | typeof ProductionDevMode =
  process.env.NODE_ENV === 'development' ? DevelopmentDevMode : ProductionDevMode
