import { CrmServiceProviderMetadata } from '../../types'
import type { IArtifact, RequestOptions } from '@zoho-studio/core'
import { BaseCapabilityAdapter } from '@zoho-studio/core'
import type { Maybe, PromisePaginatedResult, PaginationParams } from '@zoho-studio/utils'

export class CrmFunctionsAdapter extends BaseCapabilityAdapter {
    private getCrmMetadata(): Maybe<CrmServiceProviderMetadata> {
        return this.provider.metadata && this.provider?.metadata?.orgId
            ? (this.provider.metadata as CrmServiceProviderMetadata)
            : undefined
    }

    private async buildCrmRequestOptions(requestOptions: RequestOptions): Promise<RequestOptions> {
        const metadata = this.getCrmMetadata()
        if (!metadata) {
            throw new Error('Invalid provider metadata')
        }

        const cookies = await this.ctx.browser.getCookies(this.ctx.tab)
        if (!cookies || !cookies['CT_CSRF_TOKEN']) {
            throw new Error('CSRF token not found in cookies')
        }

        return {
            ...requestOptions,
            headers: {
                ...(requestOptions.headers || {}),
                'x-zcsrf-token': `crmcsrfparam=${cookies['CT_CSRF_TOKEN']}`,
                'Content-Type': 'application/json',
                'x-crm-org': metadata.orgId,
            },
        }
    }

    async list(pagination: PaginationParams): PromisePaginatedResult<IArtifact> {
        const requestOptions = await this.buildCrmRequestOptions({
            url: `/crm/v2/settings/functions?type=org&start=${pagination.page}&limit=${pagination.per_page}`,
            method: 'GET',
        })

        const result = await this.ctx.browser.httpRequest(this.ctx.tab, requestOptions)

        console.log('List Functions Result:', result)

        return {
            ok: false,
            error: 'Method not implemented.',
        }
    }
}
