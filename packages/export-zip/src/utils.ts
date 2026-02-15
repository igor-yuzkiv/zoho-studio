export function normalizeFileName(fileName: string, extension: string | null = null): string {
    const name = fileName.replace(/[^a-z0-9_\-.]+/gi, '_')
    if (!extension) {
        return name
    }

    return name.replace(/_{2,}/g, '_') + '.' + extension
}
