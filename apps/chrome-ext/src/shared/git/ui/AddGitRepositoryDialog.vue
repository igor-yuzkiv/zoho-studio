<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Message from 'primevue/message'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { ref } from 'vue'
import { snakeCase } from 'lodash'
import { useGitStore } from '../../../store'
import { createGitRepository } from '../api.ts'
import { CreateGitRepositoryRequest, IGitRepository } from '../types.ts'
import { useToast } from '@zoho-studio/ui-kit'

const emit = defineEmits<{ (e: 'created', payload: IGitRepository): void }>()

const toast = useToast()
const gitStore = useGitStore()
const visible = defineModel<boolean>('visible')
const isPending = ref<boolean>(false)
const repositoryName = ref<string>('')
const repositoryDescription = ref<string>('')

function closeDialog() {
    visible.value = false
    isPending.value = false
    repositoryName.value = ''
    repositoryDescription.value = ''
}

function normalizeRepositoryName() {
    repositoryName.value = snakeCase(repositoryName.value.trim().toLocaleLowerCase())
}

async function handleAddRepository() {
    normalizeRepositoryName()

    if (!repositoryName.value) {
        toast.error({ detail: 'Repository name is required.' })
        return
    }

    try {
        isPending.value = true

        const payload: CreateGitRepositoryRequest = {
            name: repositoryName.value,
            description: repositoryDescription.value.trim() || undefined,
            author: {
                name: gitStore.gitUserName,
                email: gitStore.gitUserEmail,
            },
        }

        const response = await createGitRepository(payload)
        if (!response?.name) {
            toast.error({ detail: 'Failed to create repository. Please try again.' })
            return
        }

        toast.success({ detail: 'Repository created successfully.' })
        emit('created', response)

        closeDialog()
    } catch (error) {
        console.error('Failed to create repository', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        toast.error({ detail: message })
    } finally {
        isPending.value = false
    }
}
</script>

<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        header="Git Repository"
        class="w-auto lg:w-xl"
        :closable="false"
        :dismissable-mask="false"
        :close-on-escape="false"
    >
        <div class="flex w-full flex-col items-center gap-2">
            <div class="flex w-full flex-col">
                <label class="font-bold" for="repository_name">Repository Name</label>
                <InputText
                    id="repository_name"
                    aria-describedby="repository_name-help"
                    size="small"
                    placeholder="e.g. my-repo"
                    v-model="repositoryName"
                />
            </div>

            <div class="flex w-full flex-col">
                <label class="font-bold" for="repository_description">Description</label>
                <Textarea
                    id="repository_description"
                    aria-describedby="repository_description-help"
                    v-model="repositoryDescription"
                    size="small"
                    placeholder="A brief description about the repository"
                    autoResize
                />
            </div>

            <Message v-if="!gitStore.isAuthenticated" class="w-full" severity="warn" size="small">
                Please provide <b>user.name</b> and <b>user.email</b> to add a repository.
            </Message>
        </div>

        <template #footer>
            <div class="flex w-full items-center justify-between">
                <Button
                    label="Cancel"
                    text
                    size="small"
                    @click="closeDialog"
                    :disabled="isPending"
                    severity="secondary"
                />

                <Button
                    label="Add"
                    text
                    size="small"
                    @click="handleAddRepository"
                    :disabled="!gitStore.isAuthenticated || isPending"
                />
            </div>
        </template>
    </Dialog>
</template>

<style scoped></style>
