import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { GitAuthorDto, IGitGlobalConfig, IGitRepository } from '../shared/git'

export const useGitStore = defineStore('git-store', () => {
    const globalConfig = useStorage<IGitGlobalConfig>('git-config', { userName: '', userEmail: '' })
    const repositories = useStorage<IGitRepository[]>('git-repositories', [])

    const gitAuthor = computed<GitAuthorDto>(() => ({
        name: globalConfig.value.userName,
        email: globalConfig.value.userEmail,
    }))

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

        repositories.value = nextRepos
    }

    return {
        gitAuthor,
        gitUserName,
        gitUserEmail,
        isAuthenticated,
        repositories: computed(() => repositories.value),
        addRepository,
    }
})
