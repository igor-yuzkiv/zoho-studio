import type { CapabilityAdapterConstructor } from './capability.adapter.ts'
import { IArtifact } from '../artifact'
import { ExportZipItem } from '@zoho-studio/export-zip'

export type CapabilityType = 'functions' | 'workflows' | 'modules' | 'fields'

export interface CapabilityDescriptor {
    type: CapabilityType
    title: string
    icon: string
    hideInMenu?: boolean
    dependsOn?: CapabilityType
    adapter: CapabilityAdapterConstructor
    toExportZip?: (artifact: IArtifact) => ExportZipItem[]
}
