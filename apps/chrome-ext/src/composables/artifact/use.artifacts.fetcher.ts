import { CapabilityDescriptor, IArtifact, ICapabilityAdapter, ServiceProvider } from '@zoho-studio/core'
import { PaginationParams, sleep } from '@zoho-studio/utils'

export function useArtifactsFetcher(fetchDelay = 100) {
    async function recursiveFetchArtifacts(
        adapter: ICapabilityAdapter,
        pagination: PaginationParams = { page: 1, per_page: 50 },
        result: IArtifact[] = []
    ): Promise<IArtifact[]> {
        const response = await adapter.list(pagination)

        if (!response.ok) {
            console.error(`[useArtifactsFetcher::fetchAllArtifacts] Failed to fetch artifacts from capability port`, {
                response,
                pagination,
            })

            return result
        }

        result.push(...response.data)

        if (response.meta.has_more) {
            if (fetchDelay > 0) {
                await sleep(fetchDelay)
            }

            return recursiveFetchArtifacts(adapter, { ...pagination, page: pagination.page + 1 }, result)
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
    ): Promise<IArtifact[]> {
        const result = await Promise.allSettled<IArtifact[]>(
            capabilities.map((cap) => fetchCapabilityArtifacts(provider, cap))
        )

        return result.flatMap((res) => (res.status === 'fulfilled' ? res.value : []))
    }

    return {
        fetchCapabilityArtifacts,
        fetchProviderArtifacts,
    }
}
