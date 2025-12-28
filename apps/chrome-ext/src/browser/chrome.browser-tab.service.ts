import { BrowserTab, BrowserTabService, InjectedScript, BrowserTabChangeHandler } from '@zoho-studio/core'

function mapChromeTabToBrowserTab(t: chrome.tabs.Tab): BrowserTab | null {
    if (!t?.id) return null

    return {
        id: t.id,
        title: t.title || '',
        url: t.url || ''
    }
}

export class ChromeBrowserTabServiceImpl implements BrowserTabService {
    async listTabs(): Promise<BrowserTab[]> {
        const chromeTabs = await chrome.tabs.query({})

        return chromeTabs.reduce<BrowserTab[]>((acc, t) => {
            const browserTab = mapChromeTabToBrowserTab(t)
            if (browserTab) {
                acc.push(browserTab)
            }

            return acc
        }, [])
    }

    startWatching(handler: BrowserTabChangeHandler): () => void {
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

    async executeScript<TResponse, TArgs extends unknown[] = unknown[]>(
        tab: BrowserTab,
        args: TArgs,
        injectionScript: InjectedScript<TResponse, TArgs>
    ): Promise<TResponse> {
        if (!tab?.id) {
            throw new Error('Tab ID is missing')
        }

        const response = (await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: args,
            func: injectionScript,
        })) as chrome.scripting.InjectionResult<TResponse>[]

        if (!response?.length || response[0].result === undefined) {
            throw new Error('No response from injected script')
        }

        return response[0].result
    }
}

export const chromeBrowserTabService = new ChromeBrowserTabServiceImpl()
