import { mapCrmFunctionToArtifact, mapManyCrmFunctionsToArtifact } from './mapper.ts'
import { IArtifact, ServiceProvider } from '@zoho-studio/core'
import { BaseCapabilityAdapter } from '@zoho-studio/core'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import { CrmFunctionsApiService } from './api.ts'

export class CrmFunctionsAdapter extends BaseCapabilityAdapter {
    private api: CrmFunctionsApiService

    constructor(provider: ServiceProvider) {
        super(provider)
        this.api = new CrmFunctionsApiService(provider)
    }

    async find(artifact: IArtifact): Promise<IArtifact | null> {
        const functionId = artifact.source_id || artifact.origin?.id

        if (!functionId) {
            return null
        }

        const response = await this.api.functionDetails(functionId)
        if (!response.ok) {
            return null
        }

        return mapCrmFunctionToArtifact(response.value, this.serviceProvider.id)
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
