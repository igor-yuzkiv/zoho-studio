import { mapChromeTabToBrowserTab, mapManyChromeTabsToBrowserTabs } from './chrome.utils.ts'
import  {
    BrowserTab,
    BrowserTabChangeHandler,
    IBrowserService, RequestError,
    RequestOptions,
    RequestResponse,
} from '@zoho-studio/core'
import {injectable} from 'tsyringe'

type InjectionResult<T> = chrome.scripting.InjectionResult<RequestResponse<T>>[]

@injectable()
export class ChromeBrowserServiceImpl implements IBrowserService {
    /** Lists all browser tabs. */
    async listTabs(): Promise<BrowserTab[]> {
        const chromeTabs = await chrome.tabs.query({})
        return mapManyChromeTabsToBrowserTabs(chromeTabs)
    }

    startWatchingTabs(handler: BrowserTabChangeHandler): () => void {
        const updateHandler = (tabId: number, changeInfo: chrome.tabs.OnUpdatedInfo, tab: chrome.tabs.Tab) => {
            const browserTab = mapChromeTabToBrowserTab(tab)
            if (browserTab && changeInfo?.status === 'complete') {
                handler({ type: 'updated', tab: browserTab })
            }
        }

        const removeHandler = (tabId: number) => {
            handler({ type: 'removed', tabId: tabId })
        }

        chrome.tabs.onUpdated.addListener(updateHandler)
        chrome.tabs.onRemoved.addListener(removeHandler)

        return () => {
            chrome.tabs.onUpdated.removeListener(updateHandler)
            chrome.tabs.onRemoved.removeListener(removeHandler)
        }
    }

    async getCookies(tab: BrowserTab): Promise<Record<string, string>> {
        if (!tab?.url) {
            throw new Error('Tab URL is missing')
        }

        const url = new URL(tab.url)
        const cookies = await chrome.cookies.getAll({ url: url.origin })

        return Object.fromEntries(cookies.map((cookie) => [cookie.name, cookie.value]))
    }

    async httpRequest<T>(tab: BrowserTab, options: RequestOptions): Promise<RequestResponse<T>> {
        if (!tab?.id) {
            throw new Error('Tab ID is missing')
        }

        const response = (await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [options],
            func: async (options) => {
                try {
                    const url = new URL(options.url, window.location.origin)

                    const response = await fetch(url.toString(), {
                        method: options.method,
                        headers: options.headers || {},
                        body: options.data ? JSON.stringify(options.data || {}) : undefined,
                        credentials: 'include',
                    })

                    const data = await response.json()
                    return {
                        status: response.status,
                        data: data,
                        message: data?.message || response.statusText,
                    }
                } catch (e) {
                    return { status: 500, message: e instanceof Error ? e.message : 'Unknown error occurred' }
                }
            },
        })) as InjectionResult<T>

        if (response.length === 0 || !response[0].result) {
            throw new Error('Failed to get a valid response from the injected script.')
        }

        const result = response[0].result
        if (result.status >= 400) {
            throw new RequestError(result.status, result.message)
        }

        return response[0].result
    }
}