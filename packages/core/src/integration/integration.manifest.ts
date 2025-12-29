import type { ServiceProviderFromBrowserTabResolver, ServiceProviderType } from '../provider'

export interface IIntegrationManifest {
    serviceProviderType: ServiceProviderType
    displayName: string
    icon: string
    resolveFromBrowserTab: ServiceProviderFromBrowserTabResolver
}
