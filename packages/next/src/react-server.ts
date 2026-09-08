import { headers as nextHeaders } from 'next/headers'
import type { nextComponentType as reactClientComponentNextComponentType } from './index'

/**
 * @experimental This is experimental feature.
 */
export const nextComponentType: typeof reactClientComponentNextComponentType = () => 'React Server Component'

/**
 * @experimental This is experimental feature.
 */
export const headers = nextHeaders
