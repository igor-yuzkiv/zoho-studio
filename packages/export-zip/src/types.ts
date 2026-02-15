export type ExportZipItem = {
    name: string
    type: 'folder' | 'file'
    content?: string
    children?: ExportZipItem[]
}
