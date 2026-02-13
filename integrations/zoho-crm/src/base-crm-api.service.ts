import { CrmServiceProviderMetadata } from './types'
import { assertZohoCrmServiceProviderMetadata } from './utils.ts'
import {
    BrowserServiceToken, BrowserTab,
    IBrowserService,
    type RequestOptions,
    type RequestResponse,
    ServiceProvider,
} from '@zoho-studio/core'

import { container } from 'tsyringe'

export abstract class BaseCrmApiService {
    protected serviceProvider: ServiceProvider

    protected browserService: IBrowserService

    protected metadata: CrmServiceProviderMetadata

    constructor(provider: ServiceProvider) {
        this.serviceProvider = provider
        this.browserService = container.resolve<IBrowserService>(BrowserServiceToken)
        this.metadata = assertZohoCrmServiceProviderMetadata(this.serviceProvider)
    }

    async signCrmRequest(tab: BrowserTab, requestOptions: RequestOptions): Promise<RequestOptions> {
        const cookies = await this.browserService.getCookies(tab)
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
        if (!this.serviceProvider.browserTabId) {
            throw new Error('Browser tab ID is missing in service provider context')
        }

        const tab = await this.browserService.findTabBuIdOrFail(this.serviceProvider.browserTabId)

        const signedRequestOptions = await this.signCrmRequest(tab, requestOptions)
        return this.browserService.httpRequest<T>(tab, signedRequestOptions)
    }
}
