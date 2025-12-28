import type { ViewModeOption } from '../type.ts'
import { type Component, computed, ref } from 'vue'

export function useViewModeSelect(options: ViewModeOption[], defaultMode: string) {
    const current = ref<string>(defaultMode)
    const currentOption = computed<ViewModeOption | undefined>(() => {
        return options.find((option) => option.value === current.value)
    })
    const currentComponent = computed<string | Component | undefined>(() => {
        return currentOption.value?.component
    })

    return {
        options,
        current,
        currentOption,
        currentComponent,
    }
}
