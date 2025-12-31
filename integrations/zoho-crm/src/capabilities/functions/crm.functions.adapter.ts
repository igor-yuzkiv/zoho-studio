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
        const crmFunctions = this.crmApiService.listFunctions(pagination)
        console.log('CRM Functions:', crmFunctions)
        return {
            ok: false,
            error: 'Method not implemented.',
        }
    }
}
