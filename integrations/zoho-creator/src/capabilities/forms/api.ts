import { BaseCreatorApiService } from '../../base-creator-api.service.ts'
import type { CreatorMetaInfoResponse, ZohoCreatorForm } from '../../types'
import type { Result } from '@zoho-studio/utils'

type FormsMetaInfoHttpResponse = {
    apps?: CreatorMetaInfoResponse['apps']
    response?: CreatorMetaInfoResponse
}

type FormDefinitionHttpResponse = {
    script?: string
    response?: {
        script?: string
    }
}

export class CreatorFormsApiService extends BaseCreatorApiService {
    async listForms(): Promise<Result<ZohoCreatorForm[]>> {
        try {
            const response = await this.httpRequest<FormsMetaInfoHttpResponse>({
                url: `/appbuilder/${this.metadata.accountOwnerName}/${this.metadata.appLinkName}/workflow/getMetaInfo?query=currentapp&appLinkName=${this.metadata.appLinkName}&formLinkName=`,
                method: 'GET',
            })

            const apps = response.data?.response?.apps || response.data?.apps
            if (!apps || typeof apps !== 'object') {
                return { ok: false, error: 'Invalid response format' }
            }

            const appDefinition = Object.values(apps).find((app) => app?.forms && typeof app.forms === 'object')
            if (!appDefinition?.forms) {
                return { ok: true, value: [] }
            }

            const forms = Object.entries(appDefinition.forms).map(([linkName, form]) => {
                return {
                    ...form,
                    id: form.id || linkName,
                    linkName: form.linkName || linkName,
                } as ZohoCreatorForm
            })

            return { ok: true, value: forms }
        } catch (error) {
            console.error('[ZohoCreator][CreatorFormsApiService@listForms] API request failed', {
                error,
                metadata: this.metadata,
            })

            return { ok: false, error: 'Failed to fetch forms' }
        }
    }

    async formDefinition(formLinkName: string): Promise<Result<string>> {
        try {
            const csrfToken = await this.getCsrfToken()

            const response = await this.httpRequest<FormDefinitionHttpResponse>({
                url: `/appbuilder/${this.metadata.accountOwnerName}/${this.metadata.appLinkName}/applicationide/form/${formLinkName}/definition`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                data: new URLSearchParams({
                    formLinkName,
                    zccpn: csrfToken,
                }).toString() as unknown as Record<string, unknown>,
            })

            const script = response.data?.response?.script || response.data?.script
            if (typeof script !== 'string') {
                return { ok: false, error: 'Invalid response format' }
            }

            return { ok: true, value: script }
        } catch (error) {
            console.error('[ZohoCreator][CreatorFormsApiService@formDefinition] API request failed', {
                error,
                formLinkName,
                metadata: this.metadata,
            })

            return { ok: false, error: 'Failed to fetch form definition' }
        }
    }
}
