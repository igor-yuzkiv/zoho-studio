import type { CapabilityType, IArtifact, IArtifactsStorage } from '@zoho-studio/core'

import { remoteApiClient } from './remote-api-client.js'

export class RemoteArtifactsStorage implements IArtifactsStorage {
    async bulkUpsert(artifacts: IArtifact[]): Promise<boolean> {
        await remoteApiClient.post('api/v1/artifacts/bulk', { artifacts })
        return true
    }

    async updateById(id: string, artifact: Partial<IArtifact>): Promise<boolean> {
        await remoteApiClient.patch(`api/v1/artifacts/${encodeURIComponent(id)}`, artifact)
        return true
    }

    async findById<T extends CapabilityType = CapabilityType>(id: string): Promise<IArtifact<T> | null> {
        const response = await remoteApiClient.get<{ ok: boolean; data: IArtifact<T> | null }>(
            `api/v1/artifacts/${encodeURIComponent(id)}`
        )
        return response.data.data
    }

    async findByProviderId<T extends CapabilityType = CapabilityType>(providerId: string): Promise<IArtifact<T>[]> {
        const response = await remoteApiClient.get<{ ok: boolean; data: IArtifact<T>[] }>('api/v1/artifacts', {
            params: { provider_id: providerId },
        })
        return response.data.data
    }

    async findByParentId<T extends CapabilityType = CapabilityType>(parentId: string): Promise<IArtifact<T>[]> {
        const response = await remoteApiClient.get<{ ok: boolean; data: IArtifact<T>[] }>('api/v1/artifacts', {
            params: { parent_id: parentId },
        })
        return response.data.data
    }

    async findByProviderIdAndCapabilityType<T extends CapabilityType = CapabilityType>(
        providerId: string,
        capabilityType: string
    ): Promise<IArtifact<T>[]> {
        const response = await remoteApiClient.get<{ ok: boolean; data: IArtifact<T>[] }>('api/v1/artifacts', {
            params: { provider_id: providerId, capability_type: capabilityType },
        })
        return response.data.data
    }

    async countByProviderId(providerId: string): Promise<number> {
        const response = await remoteApiClient.get<{ ok: boolean; count: number }>('api/v1/artifacts/count', {
            params: { provider_id: providerId },
        })
        return response.data.count
    }

    async countByProviderIdAndCapabilityTypes(providerId: string, capabilityTypes: CapabilityType[]): Promise<number> {
        const response = await remoteApiClient.get<{ ok: boolean; count: number }>('api/v1/artifacts/count', {
            params: { provider_id: providerId, capability_types: capabilityTypes },
        })
        return response.data.count
    }

    async deleteByProviderId(providerId: string): Promise<number> {
        const response = await remoteApiClient.delete<{ ok: boolean; deleted: number }>('api/v1/artifacts', {
            params: { provider_id: providerId },
        })
        return response.data.deleted
    }

    async deleteByProviderIdAndCapabilityTypes(providerId: string, capabilityTypes: CapabilityType[]): Promise<number> {
        const response = await remoteApiClient.delete<{ ok: boolean; deleted: number }>('api/v1/artifacts', {
            params: { provider_id: providerId, capability_types: capabilityTypes },
        })
        return response.data.deleted
    }
}
