<script setup lang="ts">
import { useToast } from '@zoho-studio/ui-kit'
import { useGitStore } from '../../../store'
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Message from 'primevue/message'

const toast = useToast()
const gitStore = useGitStore()
const visible = defineModel<boolean>('visible')
const isPending = ref(false)
const gitRepository = ref<string | null>(null)
const gitMessage = ref(buildDefaultGitMessage())

function buildDefaultGitMessage() {
    if (!gitStore.isAuthenticated) {
        return ''
    }

    return `Update from Zoho Studio Browser Extension by ${gitStore.gitUserName}`
}

function closeDialog() {
    visible.value = false
    isPending.value = false
    gitMessage.value = buildDefaultGitMessage()
}

function handleCommit() {
    if (!gitRepository.value || !gitMessage.value) {
        toast.error({ detail: 'Repository and commit message are required.' })
        return
    }
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
                <label class="font-bold" for="git_message">Repository</label>
                <Select
                    id="git_repository"
                    aria-describedby="git_repository-help"
                    size="small"
                    :options="gitStore.repositories"
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
                    @click="handleCommit"
                    :disabled="!gitStore.isAuthenticated || isPending"
                />
            </div>
        </template>
    </Dialog>
</template>

<style scoped></style>
