import { CapabilityDescriptor, IArtifact, ServiceProvider } from '@zoho-studio/core'
import { ExportZipItem, normalizeFileName } from '@zoho-studio/export-zip'
import { defineAsyncComponent } from 'vue'
import { CrmWebhooksAdapter } from './adapter.ts'
import { Maybe } from '@zoho-studio/utils'
import { resolveCrmUrl } from '../../interanal/utils.ts'
import { CrmServiceProviderMetadata } from '../../types'

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
        },
        viewModes: [
            {
                value: 'crm_webhook_metadata_json_view',
                label: 'Metadata',
                icon: 'si:json-duotone',
                component: defineAsyncComponent(() => import('./ui/CrmWebhookMetadataJsonView.vue')),
            },
            {
                value: 'crm_webhook_failures_view',
                label: 'Failures Log',
                icon: 'si:json-duotone',
                component: defineAsyncComponent(() => import('./ui/CrmWebhookFailuresView.vue')),
            },
        ],
    },
    getArtifactServiceUrl(provider: ServiceProvider, artifact: IArtifact): Maybe<string> {
        if (provider.type !== 'zoho-crm' || !provider.metadata?.host || !provider.metadata?.orgId) {
            console.warn('[ZohoCrm|WorkflowsDescriptor|getArtifactServiceUrl] Invalid provider metadata', provider)
            return
        }

        if (artifact.capability_type !== 'webhooks') {
            console.warn('[ZohoCrm|WorkflowsDescriptor|getArtifactServiceUrl] Invalid artifact type', artifact)
            return
        }

        return resolveCrmUrl(
            provider.metadata as CrmServiceProviderMetadata,
            `/settings/webhooks/${artifact.source_id}/edit`
        )
    },
}
