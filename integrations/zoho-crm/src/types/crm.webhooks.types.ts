import type { ModuleRef } from './crm.modules.types.ts'
import type { IEntity, Maybe } from '@zoho-studio/utils'

export type ZohoCrmWebhookUserRef = {
    id: string
    name: string
}

export type ZohoCrmWebhookModuleRef = ModuleRef & {
    moduleName: string
    singular_label: string
    plural_label: string
}

export type ZohoCrmWebhookLockStatus = {
    locked: boolean
}

export interface ZohoCrmWebhook extends IEntity {
    id: string
    name: string
    description: Maybe<string>
    url: string
    display_url: Maybe<string>
    source: string
    feature_type: string
    http_method: string
    associated: boolean
    editable: boolean
    deletable: boolean
    created_time: string
    modified_time: string
    module: Maybe<ZohoCrmWebhookModuleRef>
    related_module: Maybe<ZohoCrmWebhookModuleRef>
    created_by: Maybe<ZohoCrmWebhookUserRef>
    modified_by: Maybe<ZohoCrmWebhookUserRef>
    lock_status: Maybe<ZohoCrmWebhookLockStatus>
}

export type ZohoCrmWebhookFailuresRequest = {
    webhook_id: string
    from: string
    to: string
    page: number
    per_page: number
}

export type ZohoCrmWebhookFailEntry = {
    id: string
    webhook: {
        id: string
        name: string
    }
    failure_reason: string
    failure_time: string
    workflow_rule: {
        id: string
        name: string
    }
    entity_details: {
        id: string
        module: ModuleRef
    }
}

export type ZohoCrmWebhookFailuresResponse = {
    webhook_failures: ZohoCrmWebhookFailEntry[]
    info: {
        count: number
        page: number
        per_page: number
        more_records: boolean
    }
}
