import { CrmServiceProviderMetadata } from '../types'
import { assertZohoCrmServiceProviderMetadata } from '../utils'
import {
    BrowserServiceToken,
    CapabilityAdapterContext,
    IBrowserService,
    type RequestOptions,
    type RequestResponse,
} from '@zoho-studio/core'

import { container } from 'tsyringe'

export abstract class CrmApiService {
    protected ctx: CapabilityAdapterContext

    protected browserService: IBrowserService

    protected metadata: CrmServiceProviderMetadata

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
}
