import { ZohoCrmWorkflow } from '../../types'
import { IArtifact, makeArtifactId, type ServiceProviderId } from '@zoho-studio/core'

export function mapCrmWorkflowToArtifact(
    data: ZohoCrmWorkflow,
    providerId: ServiceProviderId
): IArtifact<'workflows', ZohoCrmWorkflow> {
    return {
        id: makeArtifactId(providerId, 'workflows', data.id),
        source_id: data.id,
        capability_type: 'workflows',
        provider_id: providerId,
        display_name: data.name,
        api_name: '',
        payload: {},
        origin: data,
    }
}

export function mapManyCrmWorkflowsToArtifact(
    workflows: ZohoCrmWorkflow[],
    providerId: ServiceProviderId
): IArtifact<'workflows', ZohoCrmWorkflow>[] {
    return workflows.map((i) => mapCrmWorkflowToArtifact(i, providerId))
}
