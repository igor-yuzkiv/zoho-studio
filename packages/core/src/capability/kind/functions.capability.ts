import type { Maybe } from '@zoho-studio/utils'

export type FunctionType = 'button' | 'standalone' | 'dynamic' | 'automation' | 'scheduler' | 'unknown'

export type FunctionParams = {
    name: string
    type: string
}

export type FunctionMetadata = {
    type: FunctionType
    icon: string
}

export type FunctionArtifactPayload = {
    type: FunctionType
    script?: Maybe<string>
    params?: Maybe<FunctionParams[]>
}


export const FunctionTypeMetadataMap: Record<FunctionType, FunctionMetadata> = {
    button: { type: 'button', icon: 'mdi:button-pointer' },
    standalone: { type: 'standalone', icon: 'ph:code-fill' },
    dynamic: { type: 'dynamic', icon: 'material-symbols:extension' },
    automation: { type: 'automation', icon: 'mdi:workflow' },
    scheduler: { type: 'scheduler', icon: 'mingcute:time-fill' },
    unknown: { type: 'unknown', icon: 'f7:question' },
}
