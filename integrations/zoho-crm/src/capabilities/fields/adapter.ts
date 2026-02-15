import { mapManyCrmFieldsToArtifact } from './mapper.ts'
import {
    ArtifactStorageToken,
    IArtifact,
    IArtifactsStorage,
    ServiceProvider,
    ServiceProviderId,
} from '@zoho-studio/core'
import { BaseCapabilityAdapter } from '@zoho-studio/core'
import { PaginationParams, PromisePaginatedResult, sleep } from '@zoho-studio/utils'
import type { ZohoCrmModule } from '../../types'
import { CrmFieldsApiService } from './api.ts'
import { container } from 'tsyringe'
import { chunk } from 'lodash'

async function fetchModuleFields(
    api: CrmFieldsApiService,
    module: IArtifact<'modules'>,
    providerId: ServiceProviderId
): Promise<IArtifact[]> {
    const origin = module.origin as ZohoCrmModule
    const result = await api.listModuleFields(origin.api_name)

    if (!result.ok) {
        console.error(`[ZohoCrm][Fields][Adapter] Failed to fetch fields for ${module.api_name} module`, result)
        return []
    }

    return mapManyCrmFieldsToArtifact(result.value, origin, providerId)
}

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
            .then((res) => res.filter((m) => (m.origin as ZohoCrmModule)?.api_supported && m.api_name))

        if (!modules.length) {
            return { ok: false, error: 'No modules available for fields fetching' }
        }

        const fields = []

        for (const modulesChunk of chunk(modules, 5)) {
            const results = await Promise.allSettled(
                modulesChunk.map((module) => fetchModuleFields(this.api, module, this.serviceProvider.id))
            ).then((res) => {
                return res.flatMap((r, i) => {
                    if (r.status === 'fulfilled') {
                        return r.value
                    }

                    console.error(
                        `[ZohoCrm][Fields][Adapter] Failed to fetch fields for ${modulesChunk[i]?.api_name || 'unknown'} module chunk`,
                        r.reason
                    )

                    return []
                })
            })

            fields.push(...results)
            await sleep(200) // Sleep to avoid hitting API rate limits
        }

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
