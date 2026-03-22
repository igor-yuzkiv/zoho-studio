import type { CrmServiceProviderMetadata } from '../types'
import { ServiceProvider } from '@zoho-studio/core'
import type { Maybe } from '@zoho-studio/utils'

export const ZOHO_CRM_REGULAR_URL_REGEX = /^(https:\/\/crm\.zoho\.[a-z]{2,})\/crm\/org(\d+)\//

export const ZOHO_CRM_SANDBOX_URL_REGEX = /^(https:\/\/crmsandbox\.zoho\.[a-z]{2,})\/crm\/(\w+)\//

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

export function assertZohoCrmServiceProviderMetadata(provider: ServiceProvider): CrmServiceProviderMetadata {
    if (!provider?.metadata || !provider?.metadata?.orgId) {
        throw new Error('Invalid provider metadata')
    }
    return provider.metadata as CrmServiceProviderMetadata
}

export function resolveCrmUrl(metadata: CrmServiceProviderMetadata, path: string) {
    const baseUrl = metadata.host
    const orgId = metadata.orgId
    const orgSegment = metadata.isSandbox ? `${orgId}` : `org${orgId}`

    return `${baseUrl}/crm/${orgSegment}/${path.replace(/^\/+/, '')}`
}
