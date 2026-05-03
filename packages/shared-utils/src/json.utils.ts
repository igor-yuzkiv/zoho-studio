export function normalizeJsonDeep(value: unknown): unknown {
    if (typeof value === 'string') {
        const trimmed = value.trim()

        if (
            trimmed.startsWith('{') ||
            trimmed.startsWith('[') ||
            trimmed.startsWith('"{') ||
            trimmed.startsWith('"[')
        ) {
            try {
                const parsed = JSON.parse(value)
                return normalizeJsonDeep(parsed)
            } catch {
                return value
            }
        }

        return value
    }

    if (Array.isArray(value)) {
        return value.map(normalizeJsonDeep)
    }

    if (value && typeof value === 'object') {
        const result: Record<string, unknown> = {}

        for (const [k, v] of Object.entries(value)) {
            result[k] = normalizeJsonDeep(v)
        }

        return result
    }

    return value
}
