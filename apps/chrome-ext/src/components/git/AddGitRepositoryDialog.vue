<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Message from 'primevue/message'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

const emit = defineEmits<{
    (e: 'submit'): void
    (e: 'cancel'): void
}>()
defineProps<{
    isAuthenticated: boolean
    loading: boolean
}>()

const visible = defineModel<boolean>('visible')
const repositoryName = defineModel<string>('repositoryName')
const repositoryDescription = defineModel<string>('repositoryDescription')

function closeDialog() {
    visible.value = false
    emit('cancel')
}
</script>

<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        header="Git Repository"
        class="w-auto min-w-xl"
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

            <Message v-if="!isAuthenticated" class="w-full" severity="warn" size="small">
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
                    :disabled="loading"
                    severity="secondary"
                />

                <Button
                    label="Add"
                    text
                    size="small"
                    @click="$emit('submit')"
                    :disabled="!isAuthenticated || loading"
                />
            </div>
        </template>
    </Dialog>
</template>

<style scoped></style>
