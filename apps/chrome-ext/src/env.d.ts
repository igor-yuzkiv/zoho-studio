/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string
    readonly VITE_APP_VERSION: string
    readonly VITE_REMOTE_SERVER_API_BASE_URL: string
    readonly VITE_API_PROXY_TARGET: string
    readonly VITE_API_HOST_PERMISSION_URL: string
    readonly VITE_GITHUB_REPO_URL: string
    readonly VITE_FEATURE_GIT?: string
    readonly VITE_STORAGE_STRATEGY?: 'local' | 'remote'
}
