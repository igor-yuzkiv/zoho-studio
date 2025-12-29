import type { BrowserTab } from '@zoho-studio/core'

export function mapChromeTabToBrowserTab(t: chrome.tabs.Tab): BrowserTab | null {
    if (!t?.id) return null

    return {
        id: t.id,
        title: t.title || '',
        url: t.url || '',
    }
}

export function mapManyChromeTabsToBrowserTabs(tabs: chrome.tabs.Tab[]): BrowserTab[] {
    return tabs.reduce<BrowserTab[]>((acc, t) => {
        const browserTab = mapChromeTabToBrowserTab(t)
        if (browserTab) {
            acc.push(browserTab)
        }

        return acc
    }, [])
}