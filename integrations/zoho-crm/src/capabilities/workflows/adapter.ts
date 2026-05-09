import { BaseCapabilityAdapter, IArtifact, ServiceProvider } from '@zoho-studio/core'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/shared-types'
import { CrmWorkflowsApiService } from './api.ts'
import { mapCrmWorkflowToArtifact, mapManyCrmWorkflowsToArtifact } from './mapper.ts'

export class CrmWorkflowsAdapter extends BaseCapabilityAdapter {
    private api: CrmWorkflowsApiService

    constructor(provider: ServiceProvider) {
        super(provider)
        this.api = new CrmWorkflowsApiService(provider)
    }

    async find(artifact: IArtifact): Promise<IArtifact | null> {
        const workflowId = artifact.source_id || artifact.origin?.id

        if (!workflowId) {
            return null
        }

        const response = await this.api.workflowDetails(workflowId)
        if (!response.ok) {
            return null
        }

        return mapCrmWorkflowToArtifact(response.value, this.serviceProvider.id)
    }

    async list(pagination: PaginationParams): PromisePaginatedResult<IArtifact> {
        const response = await this.api.listWorkflows(pagination)
        if (!response.ok) {
            return response
        }

        const workflows = await this.api.loadWorkflowsDetails(response.data)

        return {
            ok: true,
            data: mapManyCrmWorkflowsToArtifact(workflows, this.serviceProvider.id),
            meta: response.meta,
        }
    }
}
