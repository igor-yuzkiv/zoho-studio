import { BaseCrmApiService } from '../../base-crm-api.service.ts'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import {
    ZohoCrmWebhook,
    ZohoCrmWebhookFailEntry,
    ZohoCrmWebhookFailuresRequest,
    ZohoCrmWebhookFailuresResponse,
} from '../../types'

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

    async fetchWebhookFailures(
        payload: ZohoCrmWebhookFailuresRequest
    ): PromisePaginatedResult<ZohoCrmWebhookFailEntry> {
        const query = new URLSearchParams()
        query.set('webhook_id', payload.webhook_id)
        query.set('from', payload.from)
        query.set('to', payload.to)
        query.set('page', String(payload.page))
        query.set('per_page', String(payload.per_page))

        const response = await this.httpRequest<ZohoCrmWebhookFailuresResponse>({
            url: `/crm/v8/settings/automation/webhook_failures?${query}`,
            method: 'GET',
        })

        if (response.status === 204) {
            return {
                ok: true,
                data: [],
                meta: {
                    page: payload.page,
                    per_page: payload.per_page,
                    total: 0,
                    has_more: false,
                },
            }
        }

        if (!response.data || !Array.isArray(response.data.webhook_failures)) {
            return { ok: false, error: 'Invalid response format' }
        }

        const { webhook_failures, info } = response.data

        return {
            ok: true,
            data: webhook_failures,
            meta: {
                page: info.page,
                per_page: info.per_page,
                total: info.count,
                has_more: info.more_records,
            },
        }
    }
}
