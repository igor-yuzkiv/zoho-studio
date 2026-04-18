import { computed, ref } from 'vue'
import { type IArtifact, ServiceProvider, ServiceProviderId } from '@zoho-studio/core'
import { useProviderArtifactsQuery } from '../../queries'
import { Maybe } from '@zoho-studio/utils'
import { objectMatchesSearch } from '../../utils'

import * as zod from 'zod'
import { useArtifactsZipExport } from '../artifact'
import { CommitGitRepositoryRequest, CommitGitRepositoryResponse } from '../../types'
import { useGitConfigStore } from '../../store'
import { storeToRefs } from 'pinia'
import { remoteApiClient } from '@zoho-studio/remote-data-storage'

const FILTER_FIELDS = ['display_name', 'api_name']

const CommitRequestPayloadSchema = zod.object({
    repository: zod.string().min(1, 'Repository is required'),
    message: zod.string().min(1, 'Commit message is required'),
    author: zod.object({
        name: zod.string().min(1, 'Author user.name is required'),
        email: zod.string().email('Invalid user.email format'),
    }),
    zipFile: zod.instanceof(Blob),
})

export function useCommitProviderArtifacts() {
    const visible = ref(false)
    const isPending = ref(false)
    const isLoading = computed(() => isPending.value || isArtifactsPending.value)

    const repository = ref<string | null>(null)
    const message = ref<string>('')

    const serviceProvider = ref<ServiceProvider | null>(null)
    const providerId = computed<Maybe<ServiceProviderId>>(() => serviceProvider.value?.id || null)

    const { isPending: isArtifactsPending, data: artifacts } = useProviderArtifactsQuery(providerId)
    const filterTerm = ref('')
    const filteredArtifacts = computed(() =>
        artifacts.value.filter((a) => objectMatchesSearch<IArtifact>(a, FILTER_FIELDS, filterTerm.value))
    )

    const gitConfig = useGitConfigStore()
    const { gitUserName, gitUserEmail } = storeToRefs(gitConfig)

    const { generateProviderArtifactsZipBlob } = useArtifactsZipExport()

    function buildDefaultGitMessage() {
        const name = gitUserName.value || 'Unknown Author'
        const providerName = serviceProvider.value?.title || 'Unknown Provider'
        return `Update '${providerName}' artifacts from Zoho Studio Browser Extension by ${name}`
    }

    function openDialog(provider: ServiceProvider) {
        visible.value = true
        serviceProvider.value = provider

        repository.value =
            provider.gitRepository && gitConfig.isRepositoryExists(provider.gitRepository)
                ? provider.gitRepository
                : null

        message.value = buildDefaultGitMessage()
    }

    function closeDialog() {
        serviceProvider.value = null
        repository.value = null
        message.value = ''
        isPending.value = false
        visible.value = false
    }

    async function commit(): Promise<CommitGitRepositoryResponse> {
        if (!serviceProvider.value) {
            throw new Error('Service provider is not set')
        }

        if (!filteredArtifacts.value.length) {
            throw new Error('No artifacts to commit')
        }

        try {
            isPending.value = true

            const zipFile = await generateProviderArtifactsZipBlob(serviceProvider.value, filteredArtifacts.value)

            const requestPayload: CommitGitRepositoryRequest = CommitRequestPayloadSchema.parse({
                repository: repository.value?.trim(),
                message: message.value.trim(),
                author: {
                    name: gitUserName.value,
                    email: gitUserEmail.value,
                },
                zipFile,
            })

            const formData = new FormData()
            formData.append('file', requestPayload.zipFile, 'file.zip')
            formData.append('message', requestPayload.message)
            formData.append('repository', requestPayload.repository)
            formData.append('author[name]', requestPayload.author.name)
            formData.append('author[email]', requestPayload.author.email)

            return await remoteApiClient
                .post<CommitGitRepositoryResponse>(
                    `git/repositories/${requestPayload.repository}/commit`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                )
                .then((r) => r.data)
        } finally {
            isPending.value = false
        }
    }

    return {
        visible,
        isLoading,

        isArtifactsPending,
        artifacts,
        filterTerm,
        filteredArtifacts,

        repository,
        message,

        openDialog,
        closeDialog,
        commit,
    }
}
