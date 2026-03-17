import {
    BaseCapabilityAdapter,
    BrowserServiceToken,
    IArtifact,
    IBrowserService,
    ServiceProvider,
} from '@zoho-studio/core'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import { container } from 'tsyringe'

export class CreatorFormsAdapter extends BaseCapabilityAdapter {
    constructor(provider: ServiceProvider) {
        super(provider)
    }

    async list(pagination: PaginationParams): PromisePaginatedResult<IArtifact> {
        if (!this.serviceProvider.browserTabId) {
            throw new Error('Browser tab ID is missing in service provider context')
        }


        const browserService = container.resolve<IBrowserService>(BrowserServiceToken)

        const tab = await browserService.findTabBuIdOrFail(this.serviceProvider.browserTabId)

        const response = await browserService.httpRequest(tab, {
            url: '/appbuilder/rapidxus/rapidx-bank-reconciliation/workflow/getMetaInfo?query=currentapp&appLinkName=rapidx-bank-reconciliation&formLinkName=',
            method: 'GET',
        })

        console.log(response)

        return {
            ok: false,
            error: 'Not implemented',
        }
    }
}
