import type { RouteLocationRaw } from 'vue-router'

export type TopMenuItemProps = {
    title: string
    route: RouteLocationRaw
}

export type TopMenuProps = {
    items: TopMenuItemProps[]
}
