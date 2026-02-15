import { ExportZipItem } from './types.ts'
import { normalizeFileName } from './utils.ts'
import JSZip from 'jszip'

export function useExportZip() {
    function processItem(zip: JSZip, item: ExportZipItem) {
        if (item.type === 'folder') {
            const folder = zip.folder(item.name)
            if (!folder) {
                throw new Error(`Failed to create folder: ${item.name}`)
            }

            item.children?.forEach((child) => processItem(folder, child))
        } else {
            zip.file(item.name, item.content || '')
        }
    }

    async function downloadZip(items: ExportZipItem[], archiveName: string) {
        const zip = new JSZip()
        for (const item of items) {
            processItem(zip, item)
        }

        const content = await zip.generateAsync({ type: 'blob' })
        const url = URL.createObjectURL(content)
        const a = document.createElement('a')
        a.href = url
        a.download = normalizeFileName(archiveName, 'zip')
        a.click()
    }

    return {
        downloadZip,
    }
}
