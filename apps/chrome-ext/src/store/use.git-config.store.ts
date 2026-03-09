import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

type StoredGitConfig = {
    userName: string
    userEmail: string
}

export const useGitConfigStore = defineStore('git-config', () => {
    const storedGitConfig = useStorage<StoredGitConfig>('git-config', {
        userName: '',
        userEmail: '',
    })

    const gitUserName = computed({
        get: () => storedGitConfig.value.userName,
        set: (value: string) => {
            storedGitConfig.value.userName = value
        },
    })

    const gitUserEmail = computed({
        get: () => storedGitConfig.value.userEmail,
        set: (value: string) => {
            storedGitConfig.value.userEmail = value
        },
    })

    return {
        gitUserName,
        gitUserEmail,
    }
})
