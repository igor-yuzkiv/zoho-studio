import type { BrowserTab, IIntegrationManifest, ServiceProvider } from '@zoho-studio/core'
import type { PromiseResult } from '@zoho-studio/utils'
import { resolveCreatorServiceProviderMetadataFromUrl, makeZohoCreatorServiceProviderId } from './utils'

export const ZohoCreatorIntegrationManifest: IIntegrationManifest = {
    serviceProviderType: 'zoho-creator',
    displayName: 'Zoho Creator',
    icon: 'oui:nav-integrations',
    capabilities: [],
    async resolveFromBrowserTab(browserTab: BrowserTab): PromiseResult<ServiceProvider> {
        if (!browserTab.url) {
            return {
                ok: false,
                error: 'Browser tab has no URL',
            }
        }

        const metadata = resolveCreatorServiceProviderMetadataFromUrl(browserTab.url)
        if (!metadata) {
            return {
                ok: false,
                error: 'Browser tab does not match Zoho Creator integration',
            }
        }

        return {
            ok: true,
            value: {
                id: makeZohoCreatorServiceProviderId(metadata),
                type: 'zoho-creator',
                title: `Zoho Creator (${metadata.accountOwnerName} - ${metadata.appLinkName})`,
                metadata,
                browserTabId: browserTab.id,
                lastSyncedAt: undefined,
            },
        }
    },
}
