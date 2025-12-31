import type { IArtifact } from '../artifact'
import type { BrowserTab } from '../browser'
import type { ServiceProvider } from '../provider'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'

export type CapabilityAdapterContext = {
    provider: ServiceProvider
    tab: BrowserTab
}

export interface ICapabilityAdapter {
    readonly ctx: CapabilityAdapterContext

    list(pagination: PaginationParams): PromisePaginatedResult<IArtifact>
}

export type CapabilityAdapterConstructor = new (context: CapabilityAdapterContext) => ICapabilityAdapter

export abstract class BaseCapabilityAdapter implements ICapabilityAdapter {
    readonly ctx: CapabilityAdapterContext

    constructor(ctx: CapabilityAdapterContext) {
        this.ctx = ctx
    }

    abstract list(pagination: PaginationParams): PromisePaginatedResult<IArtifact>
}
