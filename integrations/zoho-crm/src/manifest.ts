import {
    makeZohoCrmServiceProviderId,
    makeZohoCrmServiceProviderTitle,
    resolveCrmServiceProviderMetadataFromUrl,
} from './utils'
import { BrowserTab, IIntegrationManifest, ServiceProvider } from '@zoho-studio/core'
import { Result } from '@zoho-studio/utils'

export const ZohoCrmIntegrationManifest: IIntegrationManifest = {
    serviceProviderType: 'zoho-crm',
    displayName: 'Zoho CRM',
    icon: 'arcticons:zoho-crm',
    resolveFromBrowserTab(browserTab: BrowserTab): Result<ServiceProvider> {
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
                metadata,
                browserTabId: browserTab.id,
                lastSyncedAt: undefined,
            },
        }
    },
}
