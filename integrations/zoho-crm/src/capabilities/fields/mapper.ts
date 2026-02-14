import type { ZohoCrmModule, ZohoCrmModuleField } from '../../types'
import { IArtifact, makeArtifactId, type ServiceProviderId } from '@zoho-studio/core'

function formatDisplayDataType(field: ZohoCrmModuleField): string {
    const formatters = {
        multiselectlookup: (field: ZohoCrmModuleField) => {
            const module = field?.multiselectlookup?.connected_module?.api_name
            return module ? `multiselectlookup<${module}>` : 'multiselectlookup<unknown>'
        },
        lookup: (field: ZohoCrmModuleField) => {
            const module = field?.lookup?.module?.api_name
            return module ? `lookup<${module}>` : 'lookup<unknown>'
        },
    }

    if (field.data_type in formatters) {
        return formatters[field.data_type as keyof typeof formatters](field)
    }

    return field.data_type
}

export function mapCrmFieldToArtifact(
    field: ZohoCrmModuleField,
    module: ZohoCrmModule,
    providerId: ServiceProviderId
): IArtifact<'fields', ZohoCrmModuleField> {
    return {
        id: makeArtifactId(providerId, 'fields', [module.api_name, field.api_name]),
        parent_id: makeArtifactId(providerId, 'modules', module.api_name),
        source_id: field.id,
        capability_type: 'fields',
        provider_id: providerId,
        display_name: field.field_label,
        api_name: field.api_name,
        payload: {
            data_type: field.data_type,
            display_data_type: formatDisplayDataType(field),
        },
        origin: field,
    }
}

export function mapManyCrmFieldsToArtifact(
    fields: ZohoCrmModuleField[],
    module: ZohoCrmModule,
    providerId: ServiceProviderId
): IArtifact<'fields', ZohoCrmModuleField>[] {
    return fields.map((field) => mapCrmFieldToArtifact(field, module, providerId))
}
