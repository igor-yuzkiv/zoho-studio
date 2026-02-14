import { BaseCrmApiService } from '../../base-crm-api.service.ts'
import type { ZohoCrmModuleField } from '../../types'
import type { Result } from '@zoho-studio/utils'

type FieldsListResponse = {
    fields: ZohoCrmModuleField[]
}

export class CrmFieldsApiService extends BaseCrmApiService {
    async listModuleFields(moduleApiName: string): Promise<Result<ZohoCrmModuleField[]>> {
        const query = new URLSearchParams({
            module: moduleApiName,
            type: 'all',
            skip_field_permission: 'true',
            api_name_page: 'true',
        }).toString()

        const response = await this.httpRequest<FieldsListResponse>({
            url: `/crm/v2.2/settings/fields?${query}`,
            method: 'GET',
        })

        if (!response.data || !Array.isArray(response.data.fields)) {
            return { ok: false, error: 'Invalid response format' }
        }

        return {
            ok: true,
            value: response.data.fields,
        }
    }
}
