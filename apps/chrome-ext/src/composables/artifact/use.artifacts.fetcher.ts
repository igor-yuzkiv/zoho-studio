import { CapabilityDescriptor, IArtifact, ICapabilityAdapter, ServiceProvider } from '@zoho-studio/core'
import { PaginationParams, sleep, useConsoleLogger } from '@zoho-studio/utils'

export function useArtifactsFetcher(fetchDelay = 100) {
    const logger = useConsoleLogger('useArtifactsFetcher')

    async function recursiveFetchArtifacts(
        adapter: ICapabilityAdapter,
        pagination: PaginationParams = { page: 1, per_page: 50 },
        result: IArtifact[] = []
    ): Promise<IArtifact[]> {
        if (typeof adapter.list !== 'function') {
            logger.warn(`[recursiveFetchArtifacts] Capability adapter does not implement 'list' method.`, {
                adapter,
                pagination,
            })
            return result
        }

        const response = await adapter.list(pagination)

        if (!response.ok) {
            logger.error(`[fetchAllArtifacts] Failed to fetch artifacts from capability port`, {
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

    async function fetchArtifactsByParent(
        provider: ServiceProvider,
        capability: CapabilityDescriptor,
        parentArtifact: IArtifact
    ): Promise<IArtifact[]> {
        const adapter = new capability.adapter(provider)

        if (typeof adapter.findByParent !== 'function') {
            logger.warn(`[fetchArtifactsByParent] Capability adapter does not implement 'findByParent' method.`, {
                providerId: provider.id,
                capability,
            })
            return []
        }

        return await adapter.findByParent(parentArtifact)
    }

    async function findOneArtifact(
        provider: ServiceProvider,
        capability: CapabilityDescriptor,
        artifact: IArtifact
    ): Promise<IArtifact | null> {
        const adapter = new capability.adapter(provider)

        if (typeof adapter.find !== 'function') {
            logger.warn(`[findOneArtifact] Capability adapter does not implement 'find' method.`, {
                providerId: provider.id,
                capability,
            })
            return null
        }

        return await adapter.find(artifact)
    }

    return {
        fetchCapabilityArtifacts,
        fetchProviderArtifacts,
        findOneArtifact,
        fetchArtifactsByParent,
    }
}
