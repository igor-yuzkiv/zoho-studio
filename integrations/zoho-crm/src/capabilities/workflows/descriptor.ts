import { CapabilityDescriptor, IArtifact } from '@zoho-studio/core'
import { CrmWorkflowsAdapter } from './adapter.ts'
import { ExportZipItem, normalizeFileName } from '@zoho-studio/export-zip'

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
}
