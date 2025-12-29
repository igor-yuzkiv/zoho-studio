import { CapabilityDescriptor } from '@zoho-studio/core'
import { CrmFunctionsAdapter } from './crm.functions.adapter.ts'

export const CrmFunctionsDescriptor: CapabilityDescriptor = {
    type: 'functions',
    title: 'Zoho CRM Functions',
    icon: 'material-symbols:function',
    adapter: CrmFunctionsAdapter
}