import { CapabilityDescriptor, CapabilityType, IArtifact, ICapabilityAdapter, ServiceProvider } from '@zoho-studio/core'
import { sleep } from '@zoho-studio/utils'

export function useArtifactsFetcher(fetchDelay = 100) {
    async function recursiveFetchArtifacts(
        adapter: ICapabilityAdapter,
        page = 1,
        per_page = 50,
        result: IArtifact[] = []
    ): Promise<IArtifact[]> {
        const response = await adapter.list({ page, per_page })

        if (!response.ok) {
            console.error(`[useArtifactsFetcher::fetchAllArtifacts] Failed to fetch artifacts from capability port`, {
                response,
                page: page,
                per_page: per_page,
            })

            return result
        }

        result.push(...response.data)

        if (response.meta.has_more) {
            if (fetchDelay > 0) {
                await sleep(fetchDelay)
            }

            return recursiveFetchArtifacts(adapter, page + 1, per_page, result)
        }

        return result
    }

    async function fetchCapabilityArtifacts(
        provider: ServiceProvider,
        capability: CapabilityDescriptor
    ): Promise<IArtifact[]> {
        const adapter = new capability.adapter(provider)

        return recursiveFetchArtifacts(adapter)
    }

    async function fetchProviderArtifacts(
        provider: ServiceProvider,
        capabilities: CapabilityDescriptor[]
    ): Promise<Map<CapabilityType, IArtifact[]>> {
        const result = await Promise.allSettled<IArtifact[]>(
            capabilities.map((cap) => fetchCapabilityArtifacts(provider, cap))
        )

        return new Map(
            capabilities.map((capability, index) => {
                const res = result[index]

                return [capability.type, res.status === 'fulfilled' ? res.value : []]
            })
        )
    }

    return {
        fetchCapabilityArtifacts,
        fetchProviderArtifacts,
    }
}
