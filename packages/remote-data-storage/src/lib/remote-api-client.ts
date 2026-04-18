import axios from 'axios'

const rawBaseUrl = import.meta.env.VITE_REMOTE_SERVER_API_BASE_URL?.trim() ?? ''
const proxyTarget = import.meta.env.VITE_API_PROXY_TARGET?.trim() ?? ''
const isExtensionContext =
    typeof window !== 'undefined' &&
    (window.location.protocol === 'chrome-extension:' || window.location.protocol === 'moz-extension:')

function joinUrl(base: string, path: string): string {
    return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

const baseURL =
    isExtensionContext && rawBaseUrl.startsWith('/') && proxyTarget ? joinUrl(proxyTarget, rawBaseUrl) : rawBaseUrl

export const remoteApiClient = axios.create({
    baseURL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})
