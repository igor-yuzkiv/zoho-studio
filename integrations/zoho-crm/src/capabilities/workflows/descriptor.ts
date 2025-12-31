import { CapabilityDescriptor } from '@zoho-studio/core'
import { CrmWorkflowsAdapter } from './adapter.ts'

export const CrmWorkflowsDescriptor: CapabilityDescriptor = {
    type: 'workflows',
    title: 'Zoho CRM Workflows',
    icon: 'mdi:workflow',
    adapter: CrmWorkflowsAdapter,
}
