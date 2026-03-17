import type { Maybe } from '@zoho-studio/utils'
import type { CreatorServiceProviderMetadata } from './types'
import type { ServiceProvider } from '@zoho-studio/core'

export const ZOHO_CREATOR_APP_URL_REGEX = /^(https:\/\/creatorapp\.zoho\.[a-z]{2,})\/([^/#]+)\/([^/#]+)(?:#([^:]+):(.+))?$/
export const ZOHO_CREATOR_APP_BUILDER_URL_REGEX = /^(https:\/\/creator\.zoho\.[a-z]{2,})\/appbuilder\/([^/]+)\/([^\/#]+)/

export function resolveCreatorServiceProviderMetadataFromUrl(url: string): Maybe<CreatorServiceProviderMetadata> {
    const [baseUrl] = url.split('#')

    const match = baseUrl.match(ZOHO_CREATOR_APP_URL_REGEX) || baseUrl.match(ZOHO_CREATOR_APP_BUILDER_URL_REGEX)

    if (!match || match.length < 4) {
        return
    }

    const [, host, accountOwnerName, appLinkName] = match

    if (!host || !accountOwnerName || !appLinkName) {
        return
    }

    return {
        host,
        accountOwnerName,
        appLinkName,
    }
}

export function makeZohoCreatorServiceProviderId(metadata: CreatorServiceProviderMetadata) {
    return `zoho-creator::${metadata.accountOwnerName}::${metadata.appLinkName}`
}

export function assertZohoCreatorServiceProviderMetadata(provider: ServiceProvider): CreatorServiceProviderMetadata {
    if (!provider?.metadata || !provider?.metadata?.host || !provider?.metadata?.accountOwnerName || !provider?.metadata?.appLinkName) {
        throw new Error('Invalid provider metadata')
    }

    return provider.metadata as CreatorServiceProviderMetadata
}
