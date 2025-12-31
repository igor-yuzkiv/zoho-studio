import type { BrowserTab, BrowserTabId } from './browser-tab.js'
import { RequestOptions, RequestResponse } from '../request'

export type BrowserTabUpdateEvent = { type: 'updated'; tab: BrowserTab }
export type BrowserTabRemoveEvent = { type: 'removed'; tabId: BrowserTabId }
export type BrowserTabChangeEvent = BrowserTabUpdateEvent | BrowserTabRemoveEvent
export type BrowserTabChangeHandler = (event: BrowserTabChangeEvent) => void

export interface IBrowserService {
    listTabs(): Promise<BrowserTab[]>

    startWatchingTabs(handler: BrowserTabChangeHandler): () => void

    getCookies(tab: BrowserTab): Promise<Record<string, string>>

    httpRequest<T>(tab: BrowserTab, options: RequestOptions): Promise<RequestResponse<T>>
}

export const BrowserServiceToken = Symbol('IBrowserService')