import type { RouteLocationRaw } from 'vue-router'

export type CapabilitiesMenuItem = {
    id: string
    title: string
    icon: string
    route: RouteLocationRaw
    hidden?: boolean
    activeMatch?: string
}

export type CapabilitiesMenuProps = {
    capabilities: CapabilitiesMenuItem[]
}
