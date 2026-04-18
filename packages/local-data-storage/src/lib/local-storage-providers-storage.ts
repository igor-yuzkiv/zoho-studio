import type { IProvidersStorage, ServiceProvider } from '@zoho-studio/core'
import type { PaginationParams, PagingResponse } from '@zoho-studio/utils'

const PROVIDERS_STORAGE_KEY = 'service-providers'

export class LocalStorageProvidersStorage implements IProvidersStorage {
    async list<TMetadata = Record<string, unknown>>(
        pagination: PaginationParams
    ): Promise<PagingResponse<ServiceProvider<TMetadata>>> {
        const providers = this.readProviders<TMetadata>()
        const start = Math.max(pagination.page - 1, 0) * pagination.per_page
        const end = start + pagination.per_page
        const data = providers.slice(start, end)

        return {
            data,
            meta: {
                page: pagination.page,
                per_page: pagination.per_page,
                total: providers.length,
                has_more: end < providers.length,
            },
        }
    }

    async upsert<TMetadata = Record<string, unknown>>(provider: ServiceProvider<TMetadata>): Promise<boolean> {
        const providers = this.readProviders<TMetadata>()
        const existingIndex = providers.findIndex((entry) => entry.id === provider.id)

        if (existingIndex >= 0) {
            providers[existingIndex] = provider
        } else {
            providers.push(provider)
        }

        globalThis.localStorage.setItem(PROVIDERS_STORAGE_KEY, JSON.stringify(providers))

        return true
    }

    private readProviders<TMetadata = Record<string, unknown>>(): ServiceProvider<TMetadata>[] {
        const rawValue = globalThis.localStorage.getItem(PROVIDERS_STORAGE_KEY)

        if (!rawValue) {
            return []
        }

        try {
            const parsed = JSON.parse(rawValue)

            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }
}
