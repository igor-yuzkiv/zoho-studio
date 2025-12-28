import { BrowserTab } from '@zoho-studio/core'

export type BrowserRequestOptions = {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATH'
    headers?: Record<string, string>
    data?: Record<string, unknown>
}

export type BrowserRequestResponse<T = unknown> = {
    status: number
    message?: string
    data: T
}

export type executeBrowserRequest = <T = unknown>(
    browserTab: BrowserTab,
    options: BrowserRequestOptions,
    injectionScript: (options: BrowserRequestOptions) => Promise<BrowserRequestResponse<T>>
) => Promise<BrowserRequestResponse<T>>
