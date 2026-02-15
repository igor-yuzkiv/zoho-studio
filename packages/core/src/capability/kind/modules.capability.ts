import { Maybe } from '@zoho-studio/utils'

export type ModuleArtifactPayload = {
    api_supported: boolean
    module_type: Maybe<string>
}
