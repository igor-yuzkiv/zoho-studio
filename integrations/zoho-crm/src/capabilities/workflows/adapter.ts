import { BaseCapabilityAdapter, CapabilityAdapterContext, IArtifact } from '@zoho-studio/core'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import { CrmWorkflowsApiService } from './api.ts'
import { mapManyCrmWorkflowsToArtifact } from './mapper.ts'

export class CrmWorkflowsAdapter extends BaseCapabilityAdapter {
    private api: CrmWorkflowsApiService

    constructor(ctx: CapabilityAdapterContext) {
        super(ctx)
        this.api = new CrmWorkflowsApiService(ctx)
    }

    async list(pagination: PaginationParams): PromisePaginatedResult<IArtifact> {
        const response = await this.api.listWorkflows(pagination)
        if (!response.ok) {
            return response
        }

        return {
            ok: true,
            data: mapManyCrmWorkflowsToArtifact(response.data, this.ctx.provider.id),
            meta: response.meta,
        }
    }
}
