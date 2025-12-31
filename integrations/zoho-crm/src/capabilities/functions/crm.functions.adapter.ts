import { mapManyCrmFunctionsToArtifact } from '../../mappers'
import { CrmApiService } from '../../services/crm-api.service.ts'
import { CapabilityAdapterContext, IArtifact } from '@zoho-studio/core'
import { BaseCapabilityAdapter } from '@zoho-studio/core'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'

export class CrmFunctionsAdapter extends BaseCapabilityAdapter {
    private crmApiService: CrmApiService

    constructor(ctx: CapabilityAdapterContext) {
        super(ctx)
        this.crmApiService = new CrmApiService(ctx)
    }

    async list(pagination: PaginationParams): PromisePaginatedResult<IArtifact> {
        const response = await this.crmApiService.listFunctions(pagination)
        if (!response.ok) {
            return response
        }

        return {
            ok: true,
            data: mapManyCrmFunctionsToArtifact(response.data, this.ctx.provider.id),
            meta: response.meta,
        }
    }
}
