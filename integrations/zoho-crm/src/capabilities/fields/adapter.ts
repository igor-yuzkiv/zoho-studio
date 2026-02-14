import { mapManyCrmFieldsToArtifact } from './mapper.ts'
import { ArtifactStorageToken, IArtifact, IArtifactsStorage, ServiceProvider } from '@zoho-studio/core'
import { BaseCapabilityAdapter } from '@zoho-studio/core'
import type { PaginationParams, PromisePaginatedResult } from '@zoho-studio/utils'
import type { ZohoCrmModule } from '../../types'
import { CrmFieldsApiService } from './api.ts'
import { container } from 'tsyringe'

export class CrmFieldsAdapter extends BaseCapabilityAdapter {
    private api: CrmFieldsApiService
    private storage: IArtifactsStorage

    constructor(provider: ServiceProvider) {
        super(provider)
        this.api = new CrmFieldsApiService(provider)
        this.storage = container.resolve<IArtifactsStorage>(ArtifactStorageToken)
    }

    async list(_pagination: PaginationParams): PromisePaginatedResult<IArtifact> {
        const modules = await this.storage
            .findByProviderIdAndCapabilityType<'modules'>(this.serviceProvider.id, 'modules')
            .then((res) => res.filter((m) => (m.origin as ZohoCrmModule)?.api_supported))

        if (!modules.length) {
            return { ok: false, error: 'No modules available for fields fetching' }
        }

        const fieldsArrays = await Promise.all(
            modules.map(async (module) => {
                const origin = module.origin as ZohoCrmModule
                const result = await this.api.listModuleFields(origin.api_name)

                if (!result.ok) {
                    console.warn(`Failed to fetch fields for module ${origin.api_name}:`, result.error)
                    return []
                }

                return mapManyCrmFieldsToArtifact(result.value, origin, this.serviceProvider.id)
            })
        )

        const fields = fieldsArrays.flat()

        return {
            ok: true,
            data: fields,
            meta: {
                total: fields.length,
                page: 1,
                per_page: fields.length,
                has_more: false,
            },
        }
    }
}
