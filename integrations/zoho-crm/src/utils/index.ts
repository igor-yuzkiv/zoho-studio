import { ZOHO_CRM_REGULAR_URL_REGEX, ZOHO_CRM_SANDBOX_URL_REGEX } from '../constants'
import type { CrmServiceProviderMetadata } from '../types'
import type { Maybe } from '@zoho-studio/utils'

export function resolveCrmServiceProviderMetadataFromUrl(url: string): Maybe<CrmServiceProviderMetadata> {
    let isSandbox = false

    let match = url.match(ZOHO_CRM_REGULAR_URL_REGEX)
    if (!match || match?.length !== 3) {
        match = url.match(ZOHO_CRM_SANDBOX_URL_REGEX)
        isSandbox = true
    }

    if (!match || match?.length !== 3) {
        return
    }

    const [, host, orgId] = match
    if (!orgId || !host) {
        return
    }

    return { host, orgId, isSandbox }
}

export function makeZohoCrmServiceProviderId(metadata: CrmServiceProviderMetadata) {
    return `zoho-crm::${metadata.isSandbox ? 'sandbox::' : ''}${metadata.orgId}`
}

export function makeZohoCrmServiceProviderTitle(metadata: CrmServiceProviderMetadata) {
    return `Zoho CRM${metadata.isSandbox ? ' Sandbox' : ''} (${metadata.orgId})`
}