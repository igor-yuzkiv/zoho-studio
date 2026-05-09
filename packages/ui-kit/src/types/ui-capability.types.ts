import { CapabilityDescriptor, IArtifact } from '@zoho-studio/core'
import type { ViewModeOption } from './view-mode.types.ts'

export type ArtifactDetailViewConfig = {
    header: {
        title: string | ((artifact: IArtifact) => string)
        subtitle?: string | ((artifact: IArtifact) => string)
    }
    viewModes: ViewModeOption[]
}


export interface UiCapabilityDescriptor extends CapabilityDescriptor {
    artifactDetailViewSettings?: Partial<ArtifactDetailViewConfig>
}
