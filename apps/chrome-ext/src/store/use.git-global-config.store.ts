import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { GitGlobalConfig } from '../shared/git'

export const useGitGlobalConfigStore = defineStore('git-config', () => {
    const globalConfig = useStorage<GitGlobalConfig>('git-config', {
        userName: '',
        userEmail: '',
    })

    const gitUserName = computed({
        get: () => globalConfig.value.userName,
        set: (value: string) => {
            globalConfig.value.userName = value
        },
    })

    const gitUserEmail = computed({
        get: () => globalConfig.value.userEmail,
        set: (value: string) => {
            globalConfig.value.userEmail = value
        },
    })

    return {
        gitUserName,
        gitUserEmail,
    }
})
