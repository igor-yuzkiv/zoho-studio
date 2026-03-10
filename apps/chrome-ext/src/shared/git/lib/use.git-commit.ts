import { computed, MaybeRefOrGetter, ref, toValue } from 'vue'
import { commitGitRepository } from '../api.ts'
import type { CommitGitRepositoryResponse, GitAuthorDto } from '../types.ts'

type GetZipFile = () => Promise<Blob | File>

export type InitGitCommitFormPayload = {
    repository?: string | null
    message?: string | null
}

export function useGitCommit(getZipFile: GetZipFile, author: MaybeRefOrGetter<GitAuthorDto>) {
        const repository = ref<string | null>(null)
    const message = ref<string>('')
    const loading = ref<boolean>(false)

    function buildDefaultGitMessage() {
        const { name } = toValue(author) || { name: 'Unknown Author' }
        return `Update from Zoho Studio Browser Extension by ${name}`
    }

    const canSubmit = computed(() => {
        return Boolean(repository.value && message.value.trim() && !loading.value)
    })

    function initForm(payload: InitGitCommitFormPayload = {}) {
        repository.value = payload.repository?.trim() || null
        message.value = payload.message?.trim() || buildDefaultGitMessage()
    }

    function resetForm() {
        repository.value = null
        message.value = buildDefaultGitMessage()
        loading.value = false
    }

    async function submitCommit(): Promise<CommitGitRepositoryResponse> {
        if (loading.value) {
            throw new Error('Commit request is already in progress.')
        }

        const commitRepository = repository.value?.trim()
        const commitMessage = message.value.trim()
        if (!commitRepository || !commitMessage) {
            throw new Error('Repository and commit message are required.')
        }

        loading.value = true
        try {
            const zipFile = await getZipFile()
            return await commitGitRepository({
                repository: commitRepository,
                message: commitMessage,
                author: toValue(author),
                zipFile,
            })
        } finally {
            loading.value = false
        }
    }

    return {
        repository,
        message,
        loading,
        canSubmit,
        initForm,
        resetForm,
        submitCommit,
    }
}
