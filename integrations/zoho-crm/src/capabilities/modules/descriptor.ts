import { CapabilityDescriptor, IArtifact } from '@zoho-studio/core'
import { CrmModulesAdapter } from './adapter.ts'
import { ExportZipItem, normalizeFileName } from '@zoho-studio/export-zip'

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
}
