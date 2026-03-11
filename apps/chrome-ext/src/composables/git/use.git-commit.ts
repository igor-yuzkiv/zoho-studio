import { ref } from 'vue'
import { commitIntoGitRepository } from '../../api'
import { CommitGitRepositoryRequest, CommitGitRepositoryResponse } from '../../types'
import { useGitConfigStore } from '../../store'
import { storeToRefs } from 'pinia'
import * as zod from 'zod'

export type InitGitCommitFormPayload = {
    repository?: string | null
    message?: string | null
}

const RequestPayloadSchema = zod.object({
    repository: zod.string().min(1, 'Repository is required'),
    message: zod.string().min(1, 'Commit message is required'),
    author: zod.object({
        name: zod.string().min(1, 'Author user.name is required'),
        email: zod.string().email('Invalid user.email format'),
    }),
    zipFile: zod.instanceof(Blob),
})

export function useGitCommit() {
    const repository = ref<string | null>(null)
    const message = ref<string>('')
    const loading = ref<boolean>(false)

    const gitStore = useGitConfigStore()
    const { gitAuthor } = storeToRefs(gitStore)

    function buildDefaultGitMessage() {
        const name = gitAuthor.value?.name || 'Unknown Author'
        return `Update from Zoho Studio Browser Extension by ${name}`
    }

    function initForm(payload: InitGitCommitFormPayload = {}) {
        repository.value = payload.repository?.trim() || null
        message.value = payload.message?.trim() || buildDefaultGitMessage()
    }

    function resetForm() {
        repository.value = null
        message.value = buildDefaultGitMessage()
        loading.value = false
    }

    async function submitCommit(zipFile: Blob | File): Promise<CommitGitRepositoryResponse> {
        if (loading.value) {
            throw new Error('Commit request is already in progress.')
        }

        loading.value = true
        try {
            const requestPayload: CommitGitRepositoryRequest = RequestPayloadSchema.parse({
                repository: repository.value?.trim(),
                message: message.value.trim(),
                author: {
                    name: gitAuthor.value.name,
                    email: gitAuthor.value.email,
                },
                zipFile,
            })

            return await commitIntoGitRepository(requestPayload)
        } finally {
            loading.value = false
        }
    }

    return {
        repository,
        message,
        loading,
        initForm,
        resetForm,
        submitCommit,
    }
}
