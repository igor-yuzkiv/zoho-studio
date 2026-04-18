import { type Serializer, useStorage } from '@vueuse/core'
import { useConsoleLogger } from '@zoho-studio/utils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type AppProfile = {
    id: string
    name: string
}

const APP_PROFILE_STORAGE_KEY = 'profile'
const logger = useConsoleLogger('useAppStore')

const LocalStorageProfileSerializer: Serializer<AppProfile | null> = {
    read(raw) {
        if (!raw) {
            return null
        }

        try {
            const parsed = JSON.parse(raw) as Partial<AppProfile> | null

            if (!parsed || typeof parsed.id !== 'string' || typeof parsed.name !== 'string') {
                return null
            }

            return {
                id: parsed.id,
                name: parsed.name,
            }
        } catch (error) {
            logger.error('Failed to parse profile from localStorage:', error)
            return null
        }
    },
    write(value) {
        return JSON.stringify(value)
    },
}

export const useAppStore = defineStore('app.state', () => {
    const loadingOverlay = ref(false)
    const isLeftSidebarCollapsed = ref(false)
    const profile = useStorage<AppProfile | null>(APP_PROFILE_STORAGE_KEY, null, undefined, {
        serializer: LocalStorageProfileSerializer,
    })

    const profileId = computed(() => profile.value?.id ?? null)
    const profileName = computed(() => profile.value?.name ?? null)

    const showLoadingOverlay = () => (loadingOverlay.value = true)
    const hideLoadingOverlay = () => (loadingOverlay.value = false)
    const toggleLoadingOverlay = () => (loadingOverlay.value = !loadingOverlay.value)
    const setProfile = (data: AppProfile) => {
        profile.value = {
            id: data.id,
            name: data.name.trim(),
        }
    }
    const getProfile = () => profile.value

    return {
        loadingOverlay,
        showLoadingOverlay,
        hideLoadingOverlay,
        toggleLoadingOverlay,
        isLeftSidebarCollapsed,
        profileId,
        profileName,
        setProfile,
        getProfile,
    }
})
