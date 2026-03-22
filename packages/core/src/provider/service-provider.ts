import { BrowserTab, BrowserTabId } from '../browser'
import { Maybe, PromiseResult } from '@zoho-studio/utils'

export type ServiceProviderId = string

export type ServiceProviderType = 'zoho-crm' | 'zoho-finance' | 'zoho-creator' | 'zoho-recruit'

export type ServiceProvider<TMetadata = Record<string, unknown>> = {
    id: ServiceProviderId
    type: ServiceProviderType
    title: string
    metadata: TMetadata
    browserTabId?: Maybe<BrowserTabId>
    lastSyncedAt?: number
    gitRepository?: string | null
}

export type ServiceProviderFromBrowserTabResolver = (browserTab: BrowserTab) => PromiseResult<ServiceProvider>
