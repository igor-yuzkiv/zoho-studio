import { CapabilityDescriptor, CapabilityType, ServiceProvider } from '@zoho-studio/core'
import { integrationsRegistry } from '../../integrations.registry.ts'
import { Maybe } from '@zoho-studio/utils'

export function useCapabilitiesManager() {
    function getStatefulCapabilities(capabilities: CapabilityDescriptor[]): CapabilityDescriptor[] {
        return capabilities.filter((capability) => !capability.stateless)
    }

    function getStatelessCapabilities(capabilities: CapabilityDescriptor[]): CapabilityDescriptor[] {
        return capabilities.filter((capability) => capability.stateless)
    }

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

    function getStatefulProviderCapabilities(provider: ServiceProvider): CapabilityDescriptor[] {
        return getStatefulCapabilities(getProviderCapabilities(provider))
    }

    function getStatelessProviderCapabilities(provider: ServiceProvider): CapabilityDescriptor[] {
        return getStatelessCapabilities(getProviderCapabilities(provider))
    }

    function splitCapabilitiesByDependency(caps: CapabilityDescriptor[]): {
        independent: CapabilityDescriptor[]
        dependent: CapabilityDescriptor[]
    } {
        const independent: CapabilityDescriptor[] = []
        const dependent: CapabilityDescriptor[] = []

        for (const cap of getStatefulCapabilities(caps)) {
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
        getStatefulCapabilities,
        getStatelessCapabilities,
        getStatefulProviderCapabilities,
        getStatelessProviderCapabilities,
        splitCapabilitiesByDependency,
    }
}
