import type { CapabilityAdapterConstructor } from './capability.adapter.ts'
import { ArtifactDetailViewConfig, IArtifact } from '../artifact'
import { ExportZipItem } from '@zoho-studio/export-zip'
import { ServiceProvider } from '../provider'
import { Maybe } from '@zoho-studio/utils'

export type CapabilityType = 'functions' | 'workflows' | 'modules' | 'fields' | 'forms' | 'webhooks' | string

export interface CapabilityDescriptor {
    type: CapabilityType
    title: string
    icon: string
    hideInMenu?: boolean
    dependsOn?: CapabilityType
    adapter: CapabilityAdapterConstructor
    toExportZip?: (artifact: IArtifact) => ExportZipItem[]

    getArtifactServiceUrl?: (provider: ServiceProvider, artifact: IArtifact) => Maybe<string>

    artifactDetailViewSettings?: Partial<ArtifactDetailViewConfig>
}
