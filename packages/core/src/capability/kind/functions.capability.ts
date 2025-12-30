import type { Maybe } from '@zoho-studio/utils'

export type FunctionParams = {
    name: string
    type: string
}

export type FunctionArtifactPayload = {
    script?: Maybe<string>
    params?: Maybe<FunctionParams[]>
}