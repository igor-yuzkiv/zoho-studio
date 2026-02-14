import { CapabilityDescriptor } from '@zoho-studio/core'
import { CrmFieldsAdapter } from './adapter.ts'

export const CrmFieldsDescriptor: CapabilityDescriptor = {
    type: 'fields',
    title: 'Zoho CRM Fields',
    icon: 'hugeicons:list-setting',
    hideInMenu: true,
    dependsOn: 'modules',
    adapter: CrmFieldsAdapter,
}
