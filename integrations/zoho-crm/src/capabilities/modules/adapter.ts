import { mapManyCrmModulesToArtifact } from './mapper.ts'
import { IArtifact, ServiceProvider } from '@zoho-studio/core'
import { BaseCapabilityAdapter } from '@zoho-studio/core'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import { CrmModulesApiService } from './api.ts'

export class CrmModulesAdapter extends BaseCapabilityAdapter {
    private api: CrmModulesApiService

    constructor(provider: ServiceProvider) {
        super(provider)
        this.api = new CrmModulesApiService(provider)
    }

    async list(pagination: PaginationParams): PromisePaginatedResult<IArtifact> {
        const response = await this.api.listModules(pagination)
        if (!response.ok) {
            return response
        }

        return {
            ok: true,
            data: mapManyCrmModulesToArtifact(response.data, this.serviceProvider.id),
            meta: response.meta,
        }
    }
}
