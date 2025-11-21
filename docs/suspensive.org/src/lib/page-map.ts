import type { PageMapItem } from '@/components/layout'
import { type NavItem, navigationConfig } from '@/config/navigation'

export type MetaRecord = Record<
  string,
  | string
  | {
      type?: 'page' | 'menu' | 'separator'
      title?: string
      display?: 'hidden' | 'children' | 'normal'
      theme?: Record<string, any>
      items?: Record<string, { title: string; href: string }>
      href?: string
    }
>

/**
 * Get page map from navigation config
 */
export function getPageMap(locale: string): PageMapItem[] {
  const navItems = navigationConfig[locale] ?? navigationConfig.en
  return convertNavItemsToPageMap(navItems)
}

function convertNavItemsToPageMap(navItems: NavItem[]): PageMapItem[] {
  return navItems.map((item) => {
    const pageMapItem: PageMapItem = {
      name: item.title,
      route: item.href || '#',
      meta: {
        title: item.title,
        display: item.hidden ? 'hidden' : 'normal',
      },
    }

    if (item.items && item.items.length > 0) {
      pageMapItem.children = convertNavItemsToPageMap(item.items)
    }

    return pageMapItem
  })
}
