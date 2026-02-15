import type { ZohoCrmModule } from '../../types'
import { IArtifact, makeArtifactId, type ServiceProviderId } from '@zoho-studio/core'

export function mapCrmModuleToArtifact(
    data: ZohoCrmModule,
    providerId: ServiceProviderId
): IArtifact<'modules', ZohoCrmModule> {
    return {
        id: makeArtifactId(providerId, 'modules', data.api_name),
        source_id: data.id,
        capability_type: 'modules',
        provider_id: providerId,
        display_name: data.singular_label,
        api_name: data.api_name,
        payload: {
            api_supported: data.api_supported,
            module_type: data.generated_type,
        },
        origin: data,
    }
}

export function mapManyCrmModulesToArtifact(
    modules: ZohoCrmModule[],
    providerId: ServiceProviderId
): IArtifact<'modules', ZohoCrmModule>[] {
    return modules.map((m) => mapCrmModuleToArtifact(m, providerId))
}
