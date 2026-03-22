import { CapabilityDescriptor, IArtifact, ServiceProvider } from '@zoho-studio/core'
import { CrmWorkflowsAdapter } from './adapter.ts'
import { ExportZipItem, normalizeFileName } from '@zoho-studio/export-zip'
import { Maybe } from '@zoho-studio/utils'
import { CrmServiceProviderMetadata } from '../../types'
import { resolveCrmUrl } from '../../interanal/utils.ts'

function toExportZip(artifact: IArtifact): ExportZipItem[] {
    if (artifact.capability_type !== 'workflows') {
        return []
    }

    const workflow = artifact as IArtifact<'workflows'>
    const name = normalizeFileName(workflow.display_name)

    return [
        {
            name: `${name}.json`,
            type: 'file',
            content: JSON.stringify(workflow.origin, null, 2),
        },
    ]
}

export const CrmWorkflowsDescriptor: CapabilityDescriptor = {
    type: 'workflows',
    title: 'Zoho CRM Workflows',
    icon: 'mdi:workflow',
    adapter: CrmWorkflowsAdapter,
    toExportZip,
    getArtifactServiceUrl(provider: ServiceProvider, artifact: IArtifact): Maybe<string> {
        if (provider.type !== 'zoho-crm' || !provider.metadata?.host || !provider.metadata?.orgId) {
            console.warn('[ZohoCrm|WorkflowsDescriptor|getArtifactServiceUrl] Invalid provider metadata', provider)
            return
        }

        if (artifact.capability_type !== 'workflows') {
            console.warn('[ZohoCrm|WorkflowsDescriptor|getArtifactServiceUrl] Invalid artifact type', artifact)
            return
        }

        return resolveCrmUrl(
            provider.metadata as CrmServiceProviderMetadata,
            `/settings/workflow-rules/${artifact.source_id}`
        )
    },
}
