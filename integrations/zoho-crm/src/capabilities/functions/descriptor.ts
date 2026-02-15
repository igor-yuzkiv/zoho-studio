import { CapabilityDescriptor, IArtifact } from '@zoho-studio/core'
import { CrmFunctionsAdapter } from './adapter.ts'
import { ExportZipItem, normalizeFileName } from '@zoho-studio/export-zip'

function toExportZip(artifact: IArtifact): ExportZipItem[] {
    if (artifact.capability_type !== 'functions') {
        return []
    }

    const fn = artifact as IArtifact<'functions'>
    const name = normalizeFileName(fn.display_name)

    return [
        {
            name,
            type: 'folder',
            children: [
                {
                    name: `${name}-metadata.json`,
                    type: 'file',
                    content: JSON.stringify(fn.origin, null, 2),
                },
                {
                    name: `${name}-code.deluge.js`,
                    type: 'file',
                    content: fn.payload.script || '',
                },
            ],
        },
    ]
}

export const CrmFunctionsDescriptor: CapabilityDescriptor = {
    type: 'functions',
    title: 'Zoho CRM Functions',
    icon: 'material-symbols:function',
    adapter: CrmFunctionsAdapter,
    toExportZip,
}
