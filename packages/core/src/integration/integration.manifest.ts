import type { ServiceProviderResolver, ServiceProviderType } from '../provider'
import type { CapabilityDescriptor } from '../capability'

export interface IIntegrationManifest {
    serviceProviderType: ServiceProviderType

    displayName: string

    icon: string

    resolveFromBrowserTab: ServiceProviderResolver

    capabilities: CapabilityDescriptor[]
}
