import { BaseCapabilityAdapter, IArtifact, ServiceProvider } from '@zoho-studio/core'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import { CrmWorkflowsApiService } from './api.ts'
import { mapManyCrmWorkflowsToArtifact } from './mapper.ts'

export class CrmWorkflowsAdapter extends BaseCapabilityAdapter {
    private api: CrmWorkflowsApiService

    constructor(provider: ServiceProvider) {
        super(provider)
        this.api = new CrmWorkflowsApiService(provider)
    }

    async list(pagination: PaginationParams): PromisePaginatedResult<IArtifact> {
        const response = await this.api.listWorkflows(pagination)
        if (!response.ok) {
            return response
        }

        return {
            ok: true,
            data: mapManyCrmWorkflowsToArtifact(response.data, this.serviceProvider.id),
            meta: response.meta,
        }
    }
}
