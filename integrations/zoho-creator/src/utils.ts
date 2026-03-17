import type { Maybe } from '@zoho-studio/utils'
import type { CreatorServiceProviderMetadata } from './types'

export const ZOHO_CREATOR_URL_REGEX = /^(https:\/\/creatorapp\.zoho\.[a-z]{2,})\/([^/#]+)\/([^/#]+)(?:#([^:]+):(.+))?$/

export function resolveCreatorServiceProviderMetadataFromUrl(url: string): Maybe<CreatorServiceProviderMetadata> {
    const match = url.match(ZOHO_CREATOR_URL_REGEX)

    if (!match || match.length !== 6) {
        return
    }

    const [, host, accountOwnerName, appLinkName, openEntityType, openEntityName] = match

    if (!host || !accountOwnerName || !appLinkName) {
        return
    }

    return {
        host,
        accountOwnerName,
        appLinkName,
        openTarget: {
            type: openEntityType,
            name: openEntityName,
        },
    }
}

export function makeZohoCreatorServiceProviderId(metadata: CreatorServiceProviderMetadata) {
    return `zoho-creator::${metadata.accountOwnerName}::${metadata.appLinkName}`
}
