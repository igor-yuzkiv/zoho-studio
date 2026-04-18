import { BrowserTab, BrowserTabId } from '../browser'
import { Maybe, PromiseResult } from '@zoho-studio/utils'
import type { AppProfile } from '../app-profile'

export type ServiceProviderId = string

export type ServiceProviderType = 'zoho-crm' | 'zoho-finance' | 'zoho-creator' | 'zoho-recruit'

export type ServiceProvider<TMetadata = Record<string, unknown>> = {
    id: ServiceProviderId
    type: ServiceProviderType
    title: string
    app_profile: AppProfile
    metadata: TMetadata
    browserTabId?: Maybe<BrowserTabId>
    lastSyncedAt?: number
    gitRepository?: string | null
    autoSyncEnabled?: boolean
    cacheTtlInMs?: number
}

export type ResolveServiceProviderContext = {
    browserTab: BrowserTab
    appProfile: AppProfile
}

export type ServiceProviderResolver = (ctx: ResolveServiceProviderContext) => PromiseResult<ServiceProvider>

export type UpdateProviderDto = Omit<ServiceProvider, 'id' | 'type' | 'metadata'>
