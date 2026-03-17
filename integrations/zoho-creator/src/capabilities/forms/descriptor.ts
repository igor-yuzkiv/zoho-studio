import { CapabilityDescriptor } from '@zoho-studio/core'
import { CreatorFormsAdapter } from './adapter.ts'
import { defineAsyncComponent } from 'vue'

export const CreatorFormsDescriptor: CapabilityDescriptor = {
    type: 'forms',
    title: 'Zoho Creator Forms',
    icon: 'fluent:form-20-filled',
    adapter: CreatorFormsAdapter,
    artifactDetailViewSettings: {
        viewModes: [
            {
                value: 'creator_form_fields_table_view',
                label: 'Fields',
                icon: 'material-symbols:table',
                component: defineAsyncComponent(() => import('./ui/CreatorFormFieldsTableView.vue')),
            },
            {
                value: 'creator_form_definition_view',
                label: 'Definition',
                icon: 'mdi:code-braces',
                component: defineAsyncComponent(() => import('./ui/CreatorFormDefinitionView.vue')),
            },
        ],
    },
}
