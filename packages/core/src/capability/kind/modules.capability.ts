import { Maybe } from '@zoho-studio/shared-types'

export type ModuleArtifactPayload = {
    api_supported: boolean
    module_type: Maybe<string>
    module_name: string
}
