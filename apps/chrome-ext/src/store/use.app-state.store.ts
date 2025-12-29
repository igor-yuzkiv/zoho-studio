import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStateStore = defineStore('app.state', () => {
    const loadingOverlay = ref(false)

    const showLoadingOverlay = () => (loadingOverlay.value = true)

    const hideLoadingOverlay = () => (loadingOverlay.value = false)
    const toggleLoadingOverlay = () => (loadingOverlay.value = !loadingOverlay.value)

    return {
        loadingOverlay,
        showLoadingOverlay,
        hideLoadingOverlay,
        toggleLoadingOverlay,
    }
})
