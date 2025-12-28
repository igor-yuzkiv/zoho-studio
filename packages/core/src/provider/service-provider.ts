import { BrowserTab, BrowserTabId } from '../browser'
import { Maybe, Result } from '@zoho-studio/utils'

export type ServiceProviderId = string

export type ServiceProviderType = 'zoho-crm' | 'zoho-finance' | 'zoho-creator' | 'zoho-recruit'

export type ServiceProvider = {
    id: ServiceProviderId
    type: ServiceProviderType
    title: string
    metadata: Record<string, unknown>
    browserTabId?: Maybe<BrowserTabId>
    lastSyncedAt?: number
}

export type ServiceProviderFromBrowserTabResolver = (browserTab: BrowserTab) => Result<ServiceProvider>
