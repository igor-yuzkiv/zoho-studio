import type { ServiceProvider } from '../../provider'
import type { PaginationParams, PagingResponse } from '@zoho-studio/utils'

export interface IProvidersStorage {
    list<TMetadata = Record<string, unknown>>(
        pagination: PaginationParams
    ): Promise<PagingResponse<ServiceProvider<TMetadata>>>

    upsert<TMetadata = Record<string, unknown>>(provider: ServiceProvider<TMetadata>): Promise<boolean>
}

export const ProvidersStorageToken = Symbol('IProvidersStorage')
