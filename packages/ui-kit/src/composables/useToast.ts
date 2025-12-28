import { type MaybeRefOrGetter, toValue } from 'vue'
import { useToast as useBaseToast } from 'primevue'
import type { ToastMessageOptions } from 'primevue/toast'

export function useToast(defaultLife: MaybeRefOrGetter<number> = 5000) {
    const baseToast = useBaseToast()

    function add(options: ToastMessageOptions) {
        baseToast.add({
            life: toValue(defaultLife),
            ...options,
        })
    }

    function error(options: ToastMessageOptions) {
        baseToast.add({
            severity: 'error',
            summary: 'Error',
            life: toValue(defaultLife),
            ...options,
        })
    }

    function warn(options: ToastMessageOptions) {
        baseToast.add({
            severity: 'warn',
            summary: 'Warning',
            life: toValue(defaultLife),
            ...options,
        })
    }

    function info(options: ToastMessageOptions) {
        baseToast.add({
            severity: 'info',
            summary: 'Info',
            life: toValue(defaultLife),
            ...options,
        })
    }

    return { add, error, warn, info }
}
