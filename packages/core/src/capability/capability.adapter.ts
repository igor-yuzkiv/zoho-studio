import type { IArtifact } from '../artifact'
import type { ServiceProvider } from '../provider'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'

export interface ICapabilityAdapter {
    readonly serviceProvider: ServiceProvider

    list(pagination: PaginationParams): PromisePaginatedResult<IArtifact>
}

export type CapabilityAdapterConstructor = new (provider: ServiceProvider) => ICapabilityAdapter

export abstract class BaseCapabilityAdapter implements ICapabilityAdapter {
    readonly serviceProvider: ServiceProvider

    protected constructor(provider: ServiceProvider) {
        this.serviceProvider = provider
    }

    abstract list(pagination: PaginationParams): PromisePaginatedResult<IArtifact>
}
