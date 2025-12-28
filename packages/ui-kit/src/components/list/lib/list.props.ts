import type { Component } from 'vue'

export type ListItemProps = {
    title?: string
    icon?: string
    tooltip?: string
    as?: string | Component | undefined
}
