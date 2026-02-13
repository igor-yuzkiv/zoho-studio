import { BaseCrmApiService } from '../../base-crm-api.service.ts'
import { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import { ZohoCrmWorkflow } from '../../types'

type WorkflowListResponse = {
    info: {
        count: number
        more_records: boolean
        page: number
        per_page: number
    }
    workflow_rules: ZohoCrmWorkflow[]
}

export class CrmWorkflowsApiService extends BaseCrmApiService {
    async listWorkflows(pagination: PaginationParams): PromisePaginatedResult<ZohoCrmWorkflow> {
        const response = await this.httpRequest<WorkflowListResponse>({
            url: `/crm/v8/settings/automation/workflow_rules?page=${pagination.page}&per_page=${pagination.per_page}`,
            method: 'GET',
        })

        if (!response.data || !Array.isArray(response.data.workflow_rules)) {
            return { ok: false, error: 'Invalid response format' }
        }

        return {
            ok: true,
            data: response.data.workflow_rules,
            meta: {
                total: response.data.info.count,
                page: response.data.info.page,
                per_page: response.data.info.per_page,
                has_more: response.data.info.more_records,
            },
        }
    }
}
