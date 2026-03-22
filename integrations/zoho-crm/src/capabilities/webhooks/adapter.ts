import { BaseCapabilityAdapter, IArtifact, ServiceProvider } from '@zoho-studio/core'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import { CrmWebhooksApiService } from './api.ts'
import { mapManyCrmWebhooksToArtifact } from './mapper.ts'

export class CrmWebhooksAdapter extends BaseCapabilityAdapter {
    private api: CrmWebhooksApiService

    constructor(provider: ServiceProvider) {
        super(provider)
        this.api = new CrmWebhooksApiService(provider)
    }

    async list(pagination: PaginationParams): PromisePaginatedResult<IArtifact> {
        const response = await this.api.listWebhooks(pagination)
        if (!response.ok) {
            return response
        }

        return {
            ok: true,
            data: mapManyCrmWebhooksToArtifact(response.data, this.serviceProvider.id),
            meta: response.meta,
        }
    }
}
