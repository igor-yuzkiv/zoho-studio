import type { IEntity } from '@zoho-studio/utils'

export interface ZohoCrmFunction extends IEntity {
    id: string
    api_name?: string
    name?: string | null
    display_name?: string
    category: string
    createdTime: number
    updatedTime: number | null
    description: string | null
    language: string
    source: string
    params?: Array<{
        name: string
        type: string
    }> | null
    return_type?: string | null
    script?: string | null
    workflow?: string | null
}
