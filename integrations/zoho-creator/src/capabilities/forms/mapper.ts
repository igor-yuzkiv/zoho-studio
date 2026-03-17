import type { IArtifact, ServiceProviderId } from '@zoho-studio/core'
import type { ZohoCreatorForm } from '../../types'

export function mapCreatorFormToArtifact(
    form: ZohoCreatorForm,
    providerId: ServiceProviderId
): IArtifact {
    const artifact = {
        id: `${providerId}:forms:${form.linkName}`,
        source_id: form.linkName,
        capability_type: 'forms',
        provider_id: providerId,
        display_name: form.displayName || form.linkName,
        api_name: form.linkName,
        payload: {
            field_count: Object.keys(form.fields || {}).length,
            is_stateless: form.isStateless,
            is_third_party_form: form.isThirdpartyForm,
        },
        origin: form,
    }

    return artifact as unknown as IArtifact
}

export function mapManyCreatorFormsToArtifact(
    forms: ZohoCreatorForm[],
    providerId: ServiceProviderId
): IArtifact[] {
    return forms.map((form) => mapCreatorFormToArtifact(form, providerId))
}
