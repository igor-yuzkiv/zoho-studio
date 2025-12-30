import { CapabilityType } from '../capability'
import { ServiceProviderId } from '../provider'
import { ArtifactId } from './artifact.ts'

export function makeArtifactId(
    providerId: ServiceProviderId,
    capabilityType: CapabilityType,
    partials: string | string[]
): ArtifactId {
    const partialsArray = Array.isArray(partials) ? partials : [partials]
    return [providerId, capabilityType, ...partialsArray].join(':')
}
