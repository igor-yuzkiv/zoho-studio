import { create, insert } from '@orama/orama'
import type { SearchableType, AnySchema, Orama } from '@orama/orama'
import { IArtifactSearchDocument } from '@zoho-studio/core'

export type ArtifactsOramaDatabaseSchema = Record<keyof IArtifactSearchDocument, SearchableType | AnySchema>

export const ARTIFACTS_ORAMA_SCHEMA: ArtifactsOramaDatabaseSchema = {
    id: 'string',
    display_name: 'string',
    capability_type: 'string',
    provider_id: 'string',
    content: 'string',
}

export class ArtifactsSearchService {
    private db: Orama<ArtifactsOramaDatabaseSchema>

    private isInitialized = false

    constructor() {
        this.db = create<ArtifactsOramaDatabaseSchema>({
            schema: ARTIFACTS_ORAMA_SCHEMA,
        })
    }

    init() {
        this.isInitialized = true
    }
}

export const artifactsSearchService = new ArtifactsSearchService()
