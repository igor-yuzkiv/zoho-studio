import { CapabilityDescriptor, CapabilityType, ServiceProviderType } from '@zoho-studio/core'
import { integrationsRegistry } from '../integrations.registry.ts'
import { Maybe } from '@zoho-studio/utils'

export function useCapabilities() {
    function getProviderCapabilities(providerType: ServiceProviderType): CapabilityDescriptor[] {
        const providerManifest = integrationsRegistry.getManifest(providerType)
        if (!providerManifest) {
            return []
        }

        return providerManifest.capabilities
    }

    function findProviderCapability(
        providerType: ServiceProviderType,
        capabilityType: CapabilityType
    ): Maybe<CapabilityDescriptor> {
        const capabilities = getProviderCapabilities(providerType)

        return capabilities.find((cap) => cap.type === capabilityType)
    }

    return {
        getProviderCapabilities,
        findProviderCapability,
    }
}
