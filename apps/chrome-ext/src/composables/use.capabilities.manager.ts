import { CapabilityDescriptor, CapabilityType, ServiceProvider } from '@zoho-studio/core'
import { integrationsRegistry } from '../integrations.registry.ts'
import { Maybe } from '@zoho-studio/utils'

export function useCapabilitiesManager() {
    function getProviderCapabilities(provider: ServiceProvider): CapabilityDescriptor[] {
        const providerManifest = integrationsRegistry.getManifest(provider.type)
        if (!providerManifest) {
            return []
        }

        return providerManifest.capabilities
    }

    function findProviderCapability(
        provider: ServiceProvider,
        capabilityType: CapabilityType
    ): Maybe<CapabilityDescriptor> {
        const capabilities = getProviderCapabilities(provider)

        return capabilities.find((cap) => cap.type === capabilityType)
    }

    function splitCapabilitiesByDependency(caps: CapabilityDescriptor[]): {
        independent: CapabilityDescriptor[]
        dependent: CapabilityDescriptor[]
    } {
        const independent: CapabilityDescriptor[] = []
        const dependent: CapabilityDescriptor[] = []

        for (const cap of caps) {
            if (cap.dependsOn) {
                dependent.push(cap)
            } else {
                independent.push(cap)
            }
        }

        return { independent, dependent }
    }

    return {
        getProviderCapabilities,
        findProviderCapability,
        splitCapabilitiesByDependency,
    }
}
