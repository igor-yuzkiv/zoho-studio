import type { IEntity } from '@zoho-studio/utils'

export type ZohoCreatorFormField = {
    componentType: string
    isSubform: boolean
    displayName: string
    type: string
    isLookup: boolean
    isMandatory: boolean
    linkName: string
    isSystemField: boolean
}

export type ZohoCreatorForm = IEntity & {
    id: string
    linkName: string
    displayName: string
    isThirdpartyForm: boolean
    isStateless: boolean
    fields: Record<string, ZohoCreatorFormField>
    definition?: string
}

export type CreatorMetaInfoResponse = {
    apps: Record<
        string,
        {
            displayName?: string
            forms?: Record<
                string,
                Omit<ZohoCreatorForm, 'id' | 'linkName'> & {
                    id?: string
                    linkName?: string
                }
            >
        }
    >
}
