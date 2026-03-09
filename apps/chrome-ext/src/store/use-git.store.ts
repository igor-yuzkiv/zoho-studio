import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { IGitGlobalConfig, IGitRepository } from '../shared/git'

export const useGitStore = defineStore('git-store', () => {
    const globalConfig = useStorage<IGitGlobalConfig>('git-config', { userName: '', userEmail: '' })

    const storedRepositories = useStorage<IGitRepository[]>('git-repositories', [])
    const repositories = computed(() => storedRepositories.value)

    const gitUserName = computed({
        get: () => globalConfig.value.userName,
        set: (value: string) => (globalConfig.value.userName = value),
    })

    const gitUserEmail = computed({
        get: () => globalConfig.value.userEmail,
        set: (value: string) => (globalConfig.value.userEmail = value),
    })

    const isAuthenticated = computed(() => {
        return !!globalConfig.value.userName && !!globalConfig.value.userEmail
    })

    function addRepository(repo: IGitRepository) {
        let founded = false

        const nextRepos = repositories.value.map((r) => {
            if (r.name === repo.name) {
                founded = true
                return repo
            }
            return r
        })

        if (!founded) {
            nextRepos.push(repo)
        }

        storedRepositories.value = nextRepos
    }

    return {
        gitUserName,
        gitUserEmail,
        isAuthenticated,
        repositories,
        addRepository,
    }
})
