import { mockApiClient } from '../mock-api.client.ts'
import type {
    BrowserTab,
    BrowserTabChangeHandler,
    BrowserService,
    RequestOptions,
    RequestResponse,
} from '@zoho-studio/core'

export class MockBrowserServiceImpl implements BrowserService {
    async listTabs(): Promise<BrowserTab[]> {
        return mockApiClient.get<chrome.tabs.Tab[]>('chrome-tabs.json').then((response) => {
            const { data } = response

            return data.reduce<BrowserTab[]>((acc, t) => {
                if (!t?.id) return acc

                acc.push({
                    id: t.id,
                    title: t.title || '',
                    url: t.url || '',
                })

                return acc
            }, [])
        })
    }

    startWatchingTabs(handler: BrowserTabChangeHandler): () => void {
        console.warn('MockChromeBrowserTabServiceImpl.startWatching is not implemented.')

        return () => {}
    }

    async getCookies(tab: BrowserTab): Promise<Record<string, string>> {
        console.warn('MockChromeBrowserTabServiceImpl.getCookies is not implemented.')
        return {}
    }

    async httpRequest<T>(tab: BrowserTab, options: RequestOptions): Promise<RequestResponse<T>> {
        console.warn('MockChromeBrowserTabServiceImpl.httpRequest is not implemented.', {
            tab,
            options,
        })

        return Promise.reject('Not implemented')
    }
}
