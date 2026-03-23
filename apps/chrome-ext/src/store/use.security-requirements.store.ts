import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

const SECURITY_REQUIREMENTS_STORAGE_KEY = 'security-requirements.accepted'

export const useSecurityRequirementsStore = defineStore('security.requirements', () => {
    const hasAcceptedRequirements = useStorage<boolean>(SECURITY_REQUIREMENTS_STORAGE_KEY, false)

    const acceptRequirements = () => {
        hasAcceptedRequirements.value = true
    }

    return {
        hasAcceptedRequirements,
        acceptRequirements,
    }
})
