export type MetaRecord = Record<string, Meta>

export type Meta =
  | {
      type: 'page'
      title?: string
      display?: 'hidden' | 'normal'
      theme?: {
        layout?: 'default' | 'full' | 'raw'
        toc?: boolean
        copyPage?: boolean
      }
    }
  | {
      type: 'menu'
      title: string
      items: Record<string, { title: string; href: string }>
    }
  | {
      type: 'separator'
      title: string
    }
  | string
