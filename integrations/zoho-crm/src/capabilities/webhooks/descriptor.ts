import { CapabilityDescriptor, IArtifact } from '@zoho-studio/core'
import { ExportZipItem, normalizeFileName } from '@zoho-studio/export-zip'
import { defineAsyncComponent } from 'vue'
import { CrmWebhooksAdapter } from './adapter.ts'

function toExportZip(artifact: IArtifact): ExportZipItem[] {
    const webhook = artifact as IArtifact
    const name = normalizeFileName(webhook.display_name)

    return [
        {
            name: `${name}.json`,
            type: 'file',
            content: JSON.stringify(webhook.origin, null, 2),
        },
    ]
}

export const CrmWebhooksDescriptor: CapabilityDescriptor = {
    type: 'webhooks',
    title: 'Zoho CRM Webhooks',
    icon: 'material-symbols:webhook',
    adapter: CrmWebhooksAdapter,
    toExportZip,
    artifactDetailViewSettings: {
        header: {
            title: (artifact) => artifact.display_name,
            subtitle: (artifact) => {
                const payload = artifact.payload as {
                    module_api_name?: string | null
                    http_method?: string | null
                }

                return [payload.module_api_name, payload.http_method].filter(Boolean).join(' - ')
            },
        },
        viewModes: [
            {
                value: 'crm_webhook_metadata_json_view',
                label: 'Metadata',
                icon: 'si:json-duotone',
                component: defineAsyncComponent(() => import('./ui/CrmWebhookMetadataJsonView.vue')),
            },
        ],
    },
}
