import { mapManyCrmFunctionsToArtifact } from './mapper.ts'
import { CapabilityAdapterContext, IArtifact } from '@zoho-studio/core'
import { BaseCapabilityAdapter } from '@zoho-studio/core'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import { CrmFunctionsApiService } from './api.ts'

export class CrmFunctionsAdapter extends BaseCapabilityAdapter {
    private api: CrmFunctionsApiService

    constructor(ctx: CapabilityAdapterContext) {
        super(ctx)
        this.api = new CrmFunctionsApiService(ctx)
    }

    async list(pagination: PaginationParams): PromisePaginatedResult<IArtifact> {
        const response = await this.api.listFunctions(pagination)
        if (!response.ok) {
            return response
        }

        const crmFunctions = await this.api.loadFunctionsDetails(response.data)

        return {
            ok: true,
            data: mapManyCrmFunctionsToArtifact(crmFunctions, this.ctx.provider.id),
            meta: response.meta,
        }
    }
}
