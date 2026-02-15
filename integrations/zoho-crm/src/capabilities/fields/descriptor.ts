import { CapabilityDescriptor, IArtifact } from '@zoho-studio/core'
import { CrmFieldsAdapter } from './adapter.ts'
import { ExportZipItem, normalizeFileName } from '@zoho-studio/export-zip'

function toExportZip(artifact: IArtifact): ExportZipItem[] {
    if (artifact.capability_type !== 'fields') {
        return []
    }

    const field = artifact as IArtifact<'fields'>
    const name = normalizeFileName(`${field.payload.parent_module_name}-${field.display_name}`)

    return [
        {
            name: `${name}.json`,
            type: 'file',
            content: JSON.stringify(field.origin, null, 2),
        },
    ]
}

export const CrmFieldsDescriptor: CapabilityDescriptor = {
    type: 'fields',
    title: 'Zoho CRM Fields',
    icon: 'hugeicons:list-setting',
    hideInMenu: true,
    dependsOn: 'modules',
    adapter: CrmFieldsAdapter,
    toExportZip,
}
