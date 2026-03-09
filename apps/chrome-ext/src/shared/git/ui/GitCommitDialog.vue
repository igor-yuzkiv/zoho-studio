<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Message from 'primevue/message'
import type { IGitRepository } from '../types.ts'

const visible = defineModel<boolean>('visible', { default: false })
const gitRepository = defineModel<string | null>('repository', { default: null })
const gitMessage = defineModel<string>('message', { default: '' })

const props = defineProps<{
    repositories: IGitRepository[]
    isAuthenticated: boolean
    loading: boolean
    canCommit: boolean
}>()

const emit = defineEmits<{
    (e: 'commit'): void
    (e: 'cancel'): void
}>()

function closeDialog() {
    visible.value = false
    emit('cancel')
}

function handleCommit() {
    emit('commit')
}
</script>

<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        header="Git Commit"
        class="w-auto lg:w-xl"
        :closable="false"
        :dismissable-mask="false"
        :close-on-escape="false"
    >
        <div class="flex w-full flex-col items-center gap-2">
            <div class="flex w-full flex-col">
                <label class="font-bold" for="git_repository">Repository</label>
                <Select
                    id="git_repository"
                    aria-describedby="git_repository-help"
                    size="small"
                    v-model="gitRepository"
                    :options="props.repositories"
                    option-label="name"
                    option-value="name"
                />
            </div>

            <div class="flex w-full flex-col">
                <label class="font-bold" for="git_message">Message</label>
                <Textarea
                    id="git_message"
                    aria-describedby="git_message-help"
                    v-model="gitMessage"
                    size="small"
                    placeholder="A brief description about the commit"
                    autoResize
                />
            </div>

            <Message v-if="!props.isAuthenticated" class="w-full" severity="warn" size="small">
                Please provide <b>user.name</b> and <b>user.email</b> to create commits.
            </Message>
        </div>

        <template #footer>
            <div class="flex w-full items-center justify-between">
                <Button
                    label="Cancel"
                    text
                    size="small"
                    @click="closeDialog"
                    :disabled="props.loading"
                    severity="secondary"
                />

                <Button
                    label="Commit"
                    text
                    size="small"
                    @click="handleCommit"
                    :disabled="!props.isAuthenticated || props.loading || !props.canCommit"
                />
            </div>
        </template>
    </Dialog>
</template>

<style scoped></style>
