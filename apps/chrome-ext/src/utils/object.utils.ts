import { get } from 'lodash'
import { Maybe } from '@zoho-studio/utils'

export function objectMatchesSearch<T extends object>(obj: T, fields: (keyof T | string)[], term: Maybe<string>): boolean {
    if (!term) {
        return true
    }

    const normalized = term.toLowerCase().trim()
    if (!normalized) return true

    return fields.some((field) => {
        const value = get(obj, field)

        return typeof value === 'string' && value.toLowerCase().includes(normalized)
    })
}
