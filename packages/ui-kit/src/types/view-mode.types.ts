import type { Component } from 'vue'

export type ViewModeOption = {
    value: string
    component: string | Component
    label?: string
    icon?: string
}
