import { computed, toValue, type MaybeRefOrGetter } from 'vue'

export function useValidationErrors(validationErrors: MaybeRefOrGetter<Record<string, string[]>> | undefined) {
    const errors = computed<Record<string, string[]>>(() => toValue(validationErrors) || {})
    const get = (field: string): string[] | undefined => errors.value[field]
    const has = (field: string): boolean => Boolean(get(field))

    return { errors, get, has }
}
