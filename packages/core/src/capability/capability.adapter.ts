import type { IArtifact } from '../artifact'
import type { BrowserTab, BrowserTabService } from '../browser'
import type { ServiceProvider } from '../provider'
import type { PromisePaginatedResult, PaginationParams } from '@zoho-studio/utils'

export type CapabilityAdapterContext = {
    tab: BrowserTab
    browser: BrowserTabService
}

export interface ICapabilityAdapter {
    readonly ctx: CapabilityAdapterContext

    readonly provider: ServiceProvider

    list(pagination: PaginationParams): PromisePaginatedResult<IArtifact>
}

export type CapabilityAdapterConstructor = new (provider: ServiceProvider, context: CapabilityAdapterContext) => ICapabilityAdapter

export abstract class BaseCapabilityAdapter implements ICapabilityAdapter {
    readonly provider: ServiceProvider

    readonly ctx: CapabilityAdapterContext

    constructor(provider: ServiceProvider, capability: CapabilityAdapterContext) {
        this.provider = provider
        this.ctx = capability
    }

    abstract list(pagination: PaginationParams): PromisePaginatedResult<IArtifact>
}
