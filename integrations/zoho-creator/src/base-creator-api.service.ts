import { assertZohoCreatorServiceProviderMetadata } from './utils.ts'
import type { CreatorServiceProviderMetadata } from './types'
import {
    BrowserServiceToken,
    type BrowserTab,
    type IBrowserService,
    type RequestOptions,
    type RequestResponse,
    ServiceProvider,
} from '@zoho-studio/core'
import { container } from 'tsyringe'

export abstract class BaseCreatorApiService {
    protected serviceProvider: ServiceProvider

    protected browserService: IBrowserService

    protected metadata: CreatorServiceProviderMetadata

    constructor(provider: ServiceProvider) {
        this.serviceProvider = provider
        this.browserService = container.resolve<IBrowserService>(BrowserServiceToken)
        this.metadata = assertZohoCreatorServiceProviderMetadata(this.serviceProvider)
    }

    protected async getBrowserTab(): Promise<BrowserTab> {
        if (!this.serviceProvider.browserTabId) {
            throw new Error('Browser tab ID is missing in service provider context')
        }

        return this.browserService.findTabBuIdOrFail(this.serviceProvider.browserTabId)
    }

    protected async getCookies(): Promise<Record<string, string>> {
        const tab = await this.getBrowserTab()
        return this.browserService.getCookies(tab)
    }

    protected async getCsrfToken(): Promise<string> {
        const cookies = await this.getCookies()
        const token = cookies.zccpn || cookies._zcsr_tmp || cookies.CT_CSRF_TOKEN || cookies.CSRF_TOKEN

        if (!token) {
            throw new Error('Creator CSRF token not found in cookies')
        }

        return token
    }

    async httpRequest<T>(requestOptions: RequestOptions): Promise<RequestResponse<T>> {
        const tab = await this.getBrowserTab()

        return this.browserService.httpRequest<T>(tab, {
            ...requestOptions,
            headers: {
                'Content-Type': 'application/json',
                ...(requestOptions.headers || {}),
            },
        })
    }
}
