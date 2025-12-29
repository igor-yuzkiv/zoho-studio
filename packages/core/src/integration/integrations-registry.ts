import type { ServiceProviderType } from '../provider'
import type { IIntegrationManifest } from './integration-manifest.ts'
import type { Maybe } from '@zoho-studio/utils'

export interface IIntegrationsRegistry {
    add(manifest: IIntegrationManifest): void

    list(): IIntegrationManifest[]

    getByType(type: ServiceProviderType): Maybe<IIntegrationManifest>
}

export class IntegrationsRegistryImpl implements IIntegrationsRegistry {
    private manifests: Map<ServiceProviderType, IIntegrationManifest> = new Map()

    add(manifest: IIntegrationManifest): void {
        if (this.manifests.has(manifest.serviceProviderType)) {
            throw new Error(`Integration manifest for type ${manifest.serviceProviderType} is already registered.`)
        }

        this.manifests.set(manifest.serviceProviderType, manifest)
    }

    list() {
        return Array.from(this.manifests.values())
    }

    getByType(type: ServiceProviderType): Maybe<IIntegrationManifest> {
        return this.manifests.get(type)
    }
}
