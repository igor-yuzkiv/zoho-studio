import type { CapabilityAdapterConstructor } from './capability.adapter.ts'
import { ArtifactDetailViewConfig, IArtifact } from '../artifact'
import { ExportZipItem } from '@zoho-studio/export-zip'

export type CapabilityType = 'functions' | 'workflows' | 'modules' | 'fields' | 'forms' | 'webhooks' | string

export interface CapabilityDescriptor {
    type: CapabilityType
    title: string
    icon: string
    hideInMenu?: boolean
    dependsOn?: CapabilityType
    adapter: CapabilityAdapterConstructor
    toExportZip?: (artifact: IArtifact) => ExportZipItem[]

    artifactDetailViewSettings?: Partial<ArtifactDetailViewConfig>
}
