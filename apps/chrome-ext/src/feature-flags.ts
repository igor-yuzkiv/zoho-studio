function isEnabled(value: string | undefined): boolean {
    if (!value) {
        return false
    }

    return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase())
}

export const isGitFeatureEnabled = isEnabled(import.meta.env.VITE_FEATURE_GIT)
