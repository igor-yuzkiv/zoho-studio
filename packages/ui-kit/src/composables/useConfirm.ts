import { useConfirm as useBaseConfirm } from 'primevue'
import type { ConfirmationOptions } from 'primevue/confirmationoptions'

export function useConfirm() {
    const baseConfirm = useBaseConfirm()

    async function requireAsync(options: Partial<ConfirmationOptions>): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            baseConfirm.require({
                header: 'Confirmation',
                ...options,
                accept: () => resolve(true),
                reject: () => resolve(false),
            })
        })
    }

    return {
        require: baseConfirm.require,
        close: baseConfirm.close,
        requireAsync,
    }
}
