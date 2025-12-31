import { CrmServiceProviderMetadata, ZohoCrmFunction } from '../types'
import { assertZohoCrmServiceProviderMetadata } from '../utils'
import {
    BrowserServiceToken,
    CapabilityAdapterContext,
    IBrowserService,
    type RequestOptions,
    type RequestResponse,
} from '@zoho-studio/core'
import { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import { container } from 'tsyringe'

export class CrmApiService {
    private ctx: CapabilityAdapterContext

    private browserService: IBrowserService

    private metadata: CrmServiceProviderMetadata

    constructor(adapterContext: CapabilityAdapterContext) {
        this.ctx = adapterContext
        this.browserService = container.resolve<IBrowserService>(BrowserServiceToken)
        this.metadata = assertZohoCrmServiceProviderMetadata(this.ctx.provider)
    }

    async signCrmRequest(requestOptions: RequestOptions): Promise<RequestOptions> {
        const cookies = await this.browserService.getCookies(this.ctx.tab)
        if (!cookies || !cookies['CT_CSRF_TOKEN']) {
            throw new Error('CSRF token not found in cookies')
        }

        return {
            ...requestOptions,
            headers: {
                ...(requestOptions.headers || {}),
                'x-zcsrf-token': `crmcsrfparam=${cookies['CT_CSRF_TOKEN']}`,
                'Content-Type': 'application/json',
                'x-crm-org': this.metadata.orgId,
            },
        }
    }

    async httpRequest<T>(requestOptions: RequestOptions): Promise<RequestResponse<T>> {
        const signedRequestOptions = await this.signCrmRequest(requestOptions)
        return this.browserService.httpRequest<T>(this.ctx.tab, signedRequestOptions)
    }

    async listFunctions(pagination: PaginationParams): PromisePaginatedResult<ZohoCrmFunction> {
        const start = pagination.page <= 1 ? 0 : (pagination.page - 1) * pagination.per_page
        const limit = pagination.per_page
        const response = await this.httpRequest<{ functions: ZohoCrmFunction[] }>({
            url: `/crm/v2/settings/functions?type=org&start=${start}&limit=${limit}`,
            method: 'GET',
        })

        console.log('listFunctions response:', response)

        return { ok: false, error: 'Method not implemented.' }
    }
}
