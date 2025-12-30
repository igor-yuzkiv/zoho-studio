import type { IArtifact } from '../artifact'
import type { BrowserTab, BrowserTabService } from '../browser'
import type { ServiceProvider } from '../provider'
import { CapabilityType } from './capability.descriptor.ts'
import type { IEntity, PaginatedResult, PaginationParams } from '@zoho-studio/utils'

export type CapabilityAdapterContext = {
    tab: BrowserTab
    browser: BrowserTabService
}

export interface ICapabilityAdapter<TCapabilityType extends CapabilityType = CapabilityType, TOrigin extends IEntity = IEntity> {
    readonly ctx: CapabilityAdapterContext

    readonly provider: ServiceProvider

    list(pagination: PaginationParams): Promise<PaginatedResult<IArtifact<TCapabilityType, TOrigin>>>
}

export type CapabilityAdapterConstructor<
    TCapabilityType extends CapabilityType = CapabilityType,
    TOrigin extends IEntity = IEntity,
> = new (provider: ServiceProvider, context: CapabilityAdapterContext) => ICapabilityAdapter<TCapabilityType, TOrigin>

export abstract class BaseCapabilityAdapter<
    TCapabilityType extends CapabilityType,
    TOrigin extends IEntity = IEntity,
> implements ICapabilityAdapter<TCapabilityType, TOrigin> {
    readonly provider: ServiceProvider

    readonly ctx: CapabilityAdapterContext

    constructor(provider: ServiceProvider, capability: CapabilityAdapterContext) {
        this.provider = provider
        this.ctx = capability
    }

    abstract list(pagination: PaginationParams): Promise<PaginatedResult<IArtifact<TCapabilityType, TOrigin>>>
}
