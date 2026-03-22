import { BaseCrmApiService } from '../../base-crm-api.service.ts'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import type { ZohoCrmWebhook } from '../../types'

type WebhooksListResponse = {
    webhooks: ZohoCrmWebhook[]
}

const WEBHOOKS_INCLUDE_DETAILS = 'display_url,related_module.plural_label,module.plural_label'

export class CrmWebhooksApiService extends BaseCrmApiService {
    async listWebhooks(pagination: PaginationParams): PromisePaginatedResult<ZohoCrmWebhook> {
        const query = new URLSearchParams({
            sort_order: 'desc',
            sort_by: 'modified_time',
            include_inner_details: WEBHOOKS_INCLUDE_DETAILS,
        }).toString()

        const response = await this.httpRequest<WebhooksListResponse>({
            url: `/crm/v8/settings/automation/webhooks?${query}`,
            method: 'GET',
        })

        if (!response.data || !Array.isArray(response.data.webhooks)) {
            return { ok: false, error: 'Invalid response format' }
        }

        const webhooks = response.data.webhooks

        return {
            ok: true,
            data: webhooks,
            meta: {
                total: webhooks.length,
                page: pagination.page,
                per_page: webhooks.length,
                has_more: false,
            },
        }
    }
}
