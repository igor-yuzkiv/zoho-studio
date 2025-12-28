import type { BrowserTab, BrowserTabId } from './browser-tab.js'

export type BrowserTabUpdateEvent = { type: 'updated'; tab: BrowserTab }
export type BrowserTabRemoveEvent = { type: 'removed'; tabId: BrowserTabId }
export type BrowserTabChangeEvent = BrowserTabUpdateEvent | BrowserTabRemoveEvent

export type BrowserTabChangeHandler = (event: BrowserTabChangeEvent) => void

export type InjectedScript<TResponse, TArgs extends unknown[] = unknown[]> = (...args: TArgs) => Promise<TResponse>

export interface BrowserTabService {
    listTabs(): Promise<BrowserTab[]>

    startWatching(handler: BrowserTabChangeHandler): () => void

    executeScript: <TResponse, TArgs extends unknown[] = unknown[]>(
        tab: BrowserTab,
        args: TArgs,
        injectionScript: InjectedScript<TResponse, TArgs>
    ) => Promise<TResponse>
}
