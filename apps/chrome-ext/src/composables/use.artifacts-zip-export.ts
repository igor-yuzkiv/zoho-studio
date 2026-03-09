import { CapabilityDescriptor, IArtifact, ServiceProvider } from '@zoho-studio/core'
import { ref } from 'vue'
import { useArtifactsStorage } from './use.artifacts.storage.ts'
import { useCapabilitiesManager } from './use.capabilities.manager.ts'
import { normalizeFileName, ExportZipItem, useExportZip } from '@zoho-studio/export-zip'
import { groupBy } from 'lodash'

export function useArtifactsZipExport() {
    const isExporting = ref(false)
    const artifactsStorage = useArtifactsStorage()
    const capabilitiesManager = useCapabilitiesManager()

    const exportZip = useExportZip()

    async function exportProviderArtifacts(provider: ServiceProvider) {
        const artifacts = await artifactsStorage.findByProviderId(provider.id)
        const capabilities = capabilitiesManager.getProviderCapabilities(provider)

        const items = generateCapabilitiesZipItems(capabilities, artifacts)

        const normalizedProviderTitle = normalizeFileName(provider.title).toLocaleLowerCase()

        await exportZip.downloadZip(
            [
                {
                    name: normalizedProviderTitle,
                    type: 'folder',
                    children: items.concat({
                        name: `manifest.json`,
                        type: 'file',
                        content: JSON.stringify(provider),
                    }),
                },
            ],
            normalizedProviderTitle
        )
    }

    function generateCapabilitiesZipItems(
        capabilities: CapabilityDescriptor[],
        artifacts: IArtifact[]
    ): ExportZipItem[] {
        const artifactsByType = groupBy(artifacts, (artifact: IArtifact) => artifact.capability_type)

        const items = [] as ExportZipItem[]

        for (const cap of capabilities) {
            const capArtifacts = artifactsByType[cap.type] || []
            if (!capArtifacts.length || !cap.toExportZip) {
                continue
            }

            items.push({
                name: normalizeFileName(cap.title),
                type: 'folder',
                children: capArtifacts.flatMap((artifact) => (cap?.toExportZip ? cap.toExportZip(artifact) : [])),
            })
        }

        return items
    }

    return {
        isExporting,
        exportProviderArtifacts,
    }
}
