import { CapabilityDescriptor, IArtifact, ServiceProvider } from '@zoho-studio/core'
import { CrmModulesAdapter } from './adapter.ts'
import { ExportZipItem, normalizeFileName } from '@zoho-studio/export-zip'
import { Maybe } from '@zoho-studio/utils'
import { resolveCrmUrl } from '../../interanal/utils.ts'
import { CrmServiceProviderMetadata } from '../../types'

function toExportZip(artifact: IArtifact): ExportZipItem[] {
    if (artifact.capability_type !== 'modules') {
        return []
    }

    const module = artifact as IArtifact<'modules'>
    const name = normalizeFileName(module.display_name)

    return [
        {
            name: `${name}.json`,
            type: 'file',
            content: JSON.stringify(module.origin, null, 2),
        },
    ]
}

export const CrmModulesDescriptor: CapabilityDescriptor = {
    type: 'modules',
    title: 'Zoho CRM Modules',
    icon: 'streamline-sharp:module',
    adapter: CrmModulesAdapter,
    toExportZip,

    getArtifactServiceUrl(provider: ServiceProvider, artifact: IArtifact): Maybe<string> {
        if (provider.type !== 'zoho-crm' || !provider.metadata?.host || !provider.metadata?.orgId) {
            console.warn('[ZohoCrm|WorkflowsDescriptor|getArtifactServiceUrl] Invalid provider metadata', provider)
            return
        }

        if (artifact.capability_type !== 'modules') {
            console.warn('[ZohoCrm|WorkflowsDescriptor|getArtifactServiceUrl] Invalid artifact type', artifact)
            return
        }

        const module = artifact as IArtifact<'modules'>

        return resolveCrmUrl(
            provider.metadata as CrmServiceProviderMetadata,
            `/settings/modules/${module.payload.module_name}/layouts`
        )
    },
}
