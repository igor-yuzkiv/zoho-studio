import type { IEntity } from '@zoho-studio/utils'

export type ZohoCrmModule = {
    id: string
    api_name: string
    plural_label: string
    singular_label: string
    description: string
    api_supported: boolean
}

export interface ZohoCrmModuleField extends IEntity {
    id: string
    api_name: string
    field_label: string
    data_type: string
    lookup?: {
        api_name: string
        display_name: string
        id: string
        module: ModuleRef
    }
    multiselectlookup: {
        api_name: string
        connectedfield_apiname: string
        connectedlookup_apiname: string
        id: string
        connected_module: ModuleRef
        linking_module: ModuleRef
        lookup_apiname: string
    }
}

export type ModuleRef = {
    api_name: string
    id: string
}

export type FieldRef = {
    api_name: string
    id: string
}
