import { headers as nextHeaders } from 'next/headers'
import type { nextComponentType as reactClientComponentNextComponentType } from './index'

export const nextComponentType: typeof reactClientComponentNextComponentType = () => 'React Server Component'

export const headers = nextHeaders
