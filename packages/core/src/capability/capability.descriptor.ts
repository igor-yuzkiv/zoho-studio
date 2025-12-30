import type { CapabilityAdapterConstructor } from './capability.adapter.ts'

export type CapabilityType = 'functions' | 'workflows' | 'modules' | 'fields'

export interface CapabilityDescriptor {
    type: CapabilityType
    title: string
    icon: string
    hideInMenu?: boolean
    adapter: CapabilityAdapterConstructor
}
