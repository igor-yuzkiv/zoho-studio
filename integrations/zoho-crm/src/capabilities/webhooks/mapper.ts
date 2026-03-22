import type { IArtifact, ServiceProviderId } from '@zoho-studio/core'
import type { ZohoCrmWebhook } from '../../types'

function resolveWebhookModuleDisplayName(webhook: ZohoCrmWebhook): string | null {
    return (
        webhook.module?.plural_label ??
        webhook.module?.singular_label ??
        webhook.related_module?.plural_label ??
        webhook.related_module?.singular_label ??
        null
    )
}

function resolveWebhookModuleApiName(webhook: ZohoCrmWebhook): string | null {
    return webhook.module?.api_name ?? webhook.related_module?.api_name ?? null
}

export function mapCrmWebhookToArtifact(
    webhook: ZohoCrmWebhook,
    providerId: ServiceProviderId
): IArtifact {
    const moduleApiName = resolveWebhookModuleApiName(webhook)
    const moduleDisplayName = resolveWebhookModuleDisplayName(webhook)

    const artifact = {
        id: `${providerId}:webhooks:${webhook.id}`,
        source_id: webhook.id,
        capability_type: 'webhooks',
        provider_id: providerId,
        display_name: webhook.name,
        api_name: moduleApiName ?? webhook.id,
        payload: {
            module_api_name: moduleApiName,
            module_display_name: moduleDisplayName,
            http_method: webhook.http_method,
            feature_type: webhook.feature_type,
            target_url: webhook.display_url ?? webhook.url,
            associated: webhook.associated,
        },
        origin: webhook,
    }

    return artifact as unknown as IArtifact
}

export function mapManyCrmWebhooksToArtifact(
    webhooks: ZohoCrmWebhook[],
    providerId: ServiceProviderId
): IArtifact[] {
    return webhooks.map((webhook) => mapCrmWebhookToArtifact(webhook, providerId))
}
