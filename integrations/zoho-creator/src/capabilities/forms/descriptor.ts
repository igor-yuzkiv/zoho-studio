import { CapabilityDescriptor } from '@zoho-studio/core'
import { CreatorFormsAdapter } from './adapter.ts'

export const CreatorFormsDescriptor: CapabilityDescriptor = {
    type: 'forms',
    title: 'Zoho Creator Forms',
    icon: 'fluent:form-20-filled',
    adapter: CreatorFormsAdapter,
}
