import {
    makeZohoCrmServiceProviderId,
    makeZohoCrmServiceProviderTitle,
    resolveCrmServiceProviderMetadataFromUrl,
} from './interanal/utils.ts'
import type { IIntegrationManifest, ResolveServiceProviderContext, ServiceProvider } from '@zoho-studio/core'
import type { PromiseResult } from '@zoho-studio/utils'

import {
    CrmFunctionsDescriptor,
    CrmWorkflowsDescriptor,
    CrmWebhooksDescriptor,
    CrmModulesDescriptor,
    CrmFieldsDescriptor,
} from './capabilities'

export const ZohoCrmIntegrationManifest: IIntegrationManifest = {
    serviceProviderType: 'zoho-crm',
    displayName: 'Zoho CRM',
    icon: 'oui:nav-integrations',
    capabilities: [
        CrmFunctionsDescriptor,
        CrmWorkflowsDescriptor,
        CrmWebhooksDescriptor,
        CrmModulesDescriptor,
        CrmFieldsDescriptor,
    ],
    async resolveFromBrowserTab({
        browserTab,
        appProfile,
    }: ResolveServiceProviderContext): PromiseResult<ServiceProvider> {
        if (!browserTab.url) {
            return {
                ok: false,
                error: 'Browser tab has no URL',
            }
        }

        const metadata = resolveCrmServiceProviderMetadataFromUrl(browserTab.url)
        if (!metadata) {
            return {
                ok: false,
                error: 'Browser tab does not match Zoho CRM integration',
            }
        }

        return {
            ok: true,
            value: {
                id: makeZohoCrmServiceProviderId(metadata),
                type: 'zoho-crm',
                title: makeZohoCrmServiceProviderTitle(metadata),
                app_profile: appProfile,
                metadata,
                browserTabId: browserTab.id,
                lastSyncedAt: undefined,
            },
        }
    },
}
