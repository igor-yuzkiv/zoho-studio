import { BrowserTab, BrowserTabChangeHandler, BrowserTabService, InjectedScript } from '@zoho-studio/core'
import { mockApiClient } from '../mock-api.client.ts'

export class MockChromeBrowserTabServiceImpl implements BrowserTabService {
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

    startWatching(handler: BrowserTabChangeHandler): () => void {
        console.warn('MockChromeBrowserTabServiceImpl.startWatching is not implemented.')

        return () => {}
    }

    async executeScript<TResponse, TArgs extends unknown[] = unknown[]>(
        tab: BrowserTab,
        args: TArgs,
        injectionScript: InjectedScript<TResponse, TArgs>
    ): Promise<TResponse> {
        throw new Error('Method not implemented.')
    }
}