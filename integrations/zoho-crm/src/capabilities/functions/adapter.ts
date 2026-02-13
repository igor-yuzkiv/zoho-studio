import { mapManyCrmFunctionsToArtifact } from './mapper.ts'
import { IArtifact, ServiceProvider } from '@zoho-studio/core'
import { BaseCapabilityAdapter } from '@zoho-studio/core'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import { CrmFunctionsApiService } from './api.ts'

export class CrmFunctionsAdapter extends BaseCapabilityAdapter {
    private api: CrmFunctionsApiService

    constructor(provoder: ServiceProvider) {
        super(provoder)
        this.api = new CrmFunctionsApiService(provoder)
    }

    async list(pagination: PaginationParams): PromisePaginatedResult<IArtifact> {
        const response = await this.api.listFunctions(pagination)
        if (!response.ok) {
            return response
        }

        const crmFunctions = await this.api.loadFunctionsDetails(response.data)

        return {
            ok: true,
            data: mapManyCrmFunctionsToArtifact(crmFunctions, this.serviceProvider.id),
            meta: response.meta,
        }
    }
}
