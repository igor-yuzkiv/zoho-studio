import axios from 'axios'

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''
const proxyTarget = import.meta.env.VITE_API_PROXY_TARGET?.trim() ?? ''
const isExtensionContext =
    typeof window !== 'undefined' &&
    (window.location.protocol === 'chrome-extension:' || window.location.protocol === 'moz-extension:')

function joinUrl(base: string, path: string): string {
    return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

const baseURL =
    isExtensionContext && rawBaseUrl.startsWith('/') && proxyTarget ? joinUrl(proxyTarget, rawBaseUrl) : rawBaseUrl

export const apiClient = axios.create({
    baseURL,
    //withCredentials: true,
    //withXSRFToken: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})
