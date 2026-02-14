import { CapabilityDescriptor } from '@zoho-studio/core'
import { CrmModulesAdapter } from './adapter.ts'

export const CrmModulesDescriptor: CapabilityDescriptor = {
    type: 'modules',
    title: 'Zoho CRM Modules',
    icon: 'streamline-sharp:module',
    adapter: CrmModulesAdapter,
}
