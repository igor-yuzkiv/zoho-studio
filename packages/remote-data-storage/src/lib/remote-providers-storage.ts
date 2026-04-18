import type { IProvidersStorage, ServiceProvider } from '@zoho-studio/core'
import type { PaginationParams, PagingResponse } from '@zoho-studio/utils'

import { remoteApiClient } from './remote-api-client.js'

export class RemoteProvidersStorage implements IProvidersStorage {
    async list<TMetadata = Record<string, unknown>>(
        pagination: PaginationParams
    ): Promise<PagingResponse<ServiceProvider<TMetadata>>> {
        const response = await remoteApiClient.get<PagingResponse<ServiceProvider<TMetadata>>>('api/v1/providers', {
            params: {
                page: pagination.page,
                per_page: pagination.per_page,
            },
        })

        return response.data
    }

    async upsert<TMetadata = Record<string, unknown>>(provider: ServiceProvider<TMetadata>): Promise<boolean> {
        await remoteApiClient.put(`api/v1/providers/${encodeURIComponent(provider.id)}`, provider)

        return true
    }
}
