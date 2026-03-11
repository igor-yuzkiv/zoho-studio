import { computed, MaybeRefOrGetter, ref, toValue } from 'vue'
import { CreateGitRepositoryRequest, GitAuthorDto, IGitRepository } from '../types.ts'
import { createGitRepository } from '../git.api.ts'

export const normalizeRepositoryName = (name: string): string => {
    return name.trim().toLowerCase().replace(/\s+/g, '-')
}

export function useAddGitRepository(author: MaybeRefOrGetter<GitAuthorDto>) {
    const repositoryName = ref<string>('')
    const repositoryDescription = ref<string>('')
    const loading = ref<boolean>(false)

    const isAuthenticated = computed(() => {
        const authorValue = toValue(author)
        return Boolean(authorValue && authorValue.name && authorValue.email)
    })

    const canSubmit = computed(() => {
        return Boolean(repositoryName.value.trim() && !loading.value && isAuthenticated.value)
    })

    async function submitNewRepository(): Promise<IGitRepository> {
        const authorValue = toValue(author)
        if (!authorValue || !authorValue.name || !authorValue.email) {
            throw new Error('Author information is required to create a Git repository.')
        }

        if (!canSubmit.value) {
            throw new Error(
                'Cannot submit: Repository name is required, author information must be valid, and no request should be in progress.'
            )
        }

        try {
            loading.value = true

            const payload: CreateGitRepositoryRequest = {
                name: normalizeRepositoryName(repositoryName.value),
                description: repositoryDescription.value.trim() || undefined,
                author: {
                    name: authorValue.name,
                    email: authorValue.email,
                },
            }

            const response = await createGitRepository(payload)
            if (!response?.name) {
                console.error('Invalid response from server:', response)
                throw new Error('Failed to create Git repository: Invalid response from server.')
            }

            return response
        } finally {
            loading.value = false
        }
    }

    function resetForm() {
        repositoryName.value = ''
        repositoryDescription.value = ''
        loading.value = false
    }

    return {
        repositoryName,
        repositoryDescription,
        loading,
        canSubmit,
        isAuthenticated,
        submitNewRepository,
        resetForm,
    }
}
