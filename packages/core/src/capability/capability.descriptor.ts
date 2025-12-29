import type { CapabilityAdapterConstructor } from './capability.adapter.ts'

export type CapabilityType = 'functions' | 'workflows' | 'modules' | 'fields' | 'variables' | 'webhooks'

export interface CapabilityDescriptor {
    type: CapabilityType
    title: string
    icon: string
    hideInMenu?: boolean
    adapter: CapabilityAdapterConstructor
}
