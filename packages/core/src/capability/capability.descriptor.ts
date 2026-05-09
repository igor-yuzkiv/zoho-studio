import type { CapabilityAdapterConstructor } from './capability.adapter.ts'
import { IArtifact } from '../artifact'
import { ExportZipItem } from '@zoho-studio/export-zip'
import { ServiceProvider } from '../provider'
import { Maybe } from '@zoho-studio/shared-types'

export type CapabilityType = 'functions' | 'workflows' | 'modules' | 'fields' | 'forms' | 'webhooks' | string

export interface CapabilityDescriptor {
    type: CapabilityType
    title: string
    icon: string
    hideInMenu?: boolean
    stateless?: boolean
    dependsOn?: CapabilityType
    adapter: CapabilityAdapterConstructor
    getArtifactServiceUrl?: (provider: ServiceProvider, artifact: IArtifact) => Maybe<string>
    toExportZip?: (artifact: IArtifact) => ExportZipItem[]
}
