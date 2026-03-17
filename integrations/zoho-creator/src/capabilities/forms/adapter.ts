import { BaseCapabilityAdapter, IArtifact, ServiceProvider } from '@zoho-studio/core'
import { sleep, type PaginationParams, type PromisePaginatedResult } from '@zoho-studio/utils'
import { CreatorFormsApiService } from './api.ts'
import { mapManyCreatorFormsToArtifact } from './mapper.ts'
import type { ZohoCreatorForm } from '../../types'

const DETAILS_CHUNK_SIZE = 3
const DETAILS_CHUNK_DELAY_MS = 350


export class CreatorFormsAdapter extends BaseCapabilityAdapter {
    private api: CreatorFormsApiService

    constructor(provider: ServiceProvider) {
        super(provider)
        this.api = new CreatorFormsApiService(provider)
    }

    private async loadFormsDefinitions(forms: ZohoCreatorForm[]): Promise<ZohoCreatorForm[]> {
        if (forms.length === 0) {
            return forms
        }

        const formsMap = Object.fromEntries(forms.map((form) => [form.linkName, form]))

        for (let index = 0; index < forms.length; index += DETAILS_CHUNK_SIZE) {
            const chunk = forms.slice(index, index + DETAILS_CHUNK_SIZE)

            const responses = await Promise.allSettled(
                chunk.map(async (form) => {
                    const definition = await this.api.formDefinition(form.linkName)
                    if (!definition.ok) {
                        return null
                    }

                    return {
                        ...form,
                        definition: definition.value,
                    } satisfies ZohoCreatorForm
                })
            )

            for (const response of responses) {
                if (response.status !== 'fulfilled' || !response.value) {
                    continue
                }

                formsMap[response.value.linkName] = response.value
            }

            if (index + DETAILS_CHUNK_SIZE < forms.length) {
                await sleep(DETAILS_CHUNK_DELAY_MS)
            }
        }

        return forms.map((form) => formsMap[form.linkName] || form)
    }

    async list(pagination: PaginationParams): PromisePaginatedResult<IArtifact> {
        const response = await this.api.listForms()
        if (!response.ok) {
            return response
        }

        const forms = await this.loadFormsDefinitions(response.value)
        const artifacts = mapManyCreatorFormsToArtifact(forms, this.serviceProvider.id)

        return {
            ok: true,
            data: artifacts,
            meta: {
                total: artifacts.length,
                page: pagination.page,
                per_page: artifacts.length,
                has_more: false,
            },
        }
    }
}
