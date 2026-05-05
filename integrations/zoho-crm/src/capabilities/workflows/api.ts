import { BaseCrmApiService } from '../../interanal/base-crm-api.service.ts'
import { PaginationParams, PromisePaginatedResult, Result } from '@zoho-studio/shared-types'
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

    async workflowDetails(workflowId: string): Promise<Result<ZohoCrmWorkflow>> {
        try {
            const response = await this.httpRequest<WorkflowListResponse>({
                url: `/crm/v8/settings/automation/workflow_rules/${workflowId}`,
                method: 'GET',
            })

            if (!response.data || !Array.isArray(response.data.workflow_rules)) {
                return { ok: false, error: 'Invalid response format' }
            }

            const workflow = response.data.workflow_rules[0]
            if (!workflow) {
                return { ok: false, error: 'Workflow not found' }
            }

            return { ok: true, value: workflow }
        } catch (error) {
            console.error(
                `[ZohoCrm][CrmWorkflowsApiService@workflowDetails] API request failed for workflow ID ${workflowId}`,
                { workflowId, error }
            )

            return { ok: false, error: 'Failed to fetch workflow details' }
        }
    }

    async loadWorkflowsDetails(workflows: ZohoCrmWorkflow[]): Promise<ZohoCrmWorkflow[]> {
        const workflowsMap = Object.fromEntries(workflows.map((wf) => [wf.id, wf]))

        const responses = await Promise.allSettled(workflows.map((wf) => this.workflowDetails(wf.id)))

        for (const res of responses) {
            if (res.status === 'fulfilled' && res.value.ok) {
                workflowsMap[res.value.value.id] = res.value.value
            }
        }

        return Object.values(workflowsMap)
    }
}
