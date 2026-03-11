import { ref } from 'vue'
import { CreateGitRepositoryRequest, IGitRepository } from '../../types'
import { createGitRepository } from '../../api'
import { useGitConfigStore } from '../../store'
import { storeToRefs } from 'pinia'
import * as zod from 'zod'

const RequestPayloadSchema = zod.object({
    name: zod.string().min(1, 'Repository name is required').max(100, 'Repository name must be at most 100 characters'),
    description: zod.string().max(255, 'Description must be at most 255 characters').optional(),
    author: zod.object({
        name: zod.string().min(1, 'Author user.name is required'),
        email: zod.string().email('Invalid user.email format'),
    }),
})

export const normalizeRepositoryName = (name: string): string => {
    return name.trim().toLowerCase().replace(/\s+/g, '-')
}

export function useAddGitRepository() {
    const repositoryName = ref<string>('')
    const repositoryDescription = ref<string>('')
    const loading = ref<boolean>(false)

    const gitStore = useGitConfigStore()
    const { gitAuthor } = storeToRefs(gitStore)

    async function submitNewRepository(): Promise<IGitRepository> {
        if (loading.value) {
            throw new Error('Repository creation is already in progress.')
        }

        try {
            loading.value = true

            const payload: CreateGitRepositoryRequest = RequestPayloadSchema.parse({
                name: normalizeRepositoryName(repositoryName.value),
                description: repositoryDescription.value.trim() || undefined,
                author: {
                    name: gitAuthor.value.name,
                    email: gitAuthor.value.email,
                },
            })

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
        submitNewRepository,
        resetForm,
    }
}
