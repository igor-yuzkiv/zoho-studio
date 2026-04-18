<script setup lang="ts">
import { IArtifact } from '@zoho-studio/core'
import Dialog from 'primevue/dialog'
import { ArtifactExplorerMenu } from '../../artifacts-explorer'
import InputText from 'primevue/inputtext'
import { useGitConfigStore } from '../../../store'
import { storeToRefs } from 'pinia'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import Message from 'primevue/message'
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'

defineProps<{
    artifacts: IArtifact[]
    loading: boolean
}>()

defineEmits<{
    (e: 'commit'): void
    (e: 'cancel'): void
}>()

const visible = defineModel<boolean>('visible', { default: false })
const filterTerm = defineModel<string>('filter-term', { default: '' })
const gitRepository = defineModel<string | null>('repository', { default: null })
const gitMessage = defineModel<string>('message', { default: '' })

const gitStore = useGitConfigStore()
const { isAuthenticated, repositories } = storeToRefs(gitStore)
</script>

<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        header="Commit Provider Artifacts"
        class="w-[90%]"
        content-class="flex flex-col w-full h-full overflow-hidden"
        :closable="false"
        :dismissable-mask="false"
        :close-on-escape="false"
    >
        <template #header>
            <div class="flex w-full items-center justify-between">
                <h1 class="w-full text-lg font-bold">Commit Provider Artifacts</h1>
                <Icon v-if="loading" icon="gg:spinner-two" class="h-7 w-7 animate-spin text-blue-600" />
            </div>
        </template>
        <div class="flex h-full w-full flex-col gap-2 overflow-hidden p-2 md:flex-row">
            <div class="flex w-full flex-col gap-2 md:w-1/2">
                <Message v-if="!isAuthenticated" class="w-full" severity="warn" size="small">
                    Please provide <b>user.name</b> and <b>user.email</b> to create commits.
                </Message>

                <div class="flex w-full flex-col gap-1">
                    <label class="font-bold" for="git_repository">Repository</label>
                    <Select
                        id="git_repository"
                        aria-describedby="git_repository-help"
                        size="small"
                        v-model="gitRepository"
                        :options="repositories"
                        option-label="name"
                        option-value="name"
                    />
                </div>

                <div class="flex w-full flex-col gap-1">
                    <label class="font-bold" for="git_message">Message</label>
                    <Textarea
                        id="git_message"
                        aria-describedby="git_message-help"
                        v-model="gitMessage"
                        size="small"
                        placeholder="A brief description about the commit"
                        rows="6"
                    />
                </div>
            </div>

            <div class="flex w-full flex-col overflow-auto md:w-1/2">
                <ArtifactExplorerMenu :items="artifacts" group-by="capability_type" :searchable="false">
                    <template #header>
                        <div class="flex items-center border-b">
                            <InputText
                                v-model.lazy="filterTerm"
                                size="small"
                                class="w-full rounded-none border-none bg-transparent shadow-none"
                                placeholder="Filter artifacts..."
                            />
                        </div>
                    </template>
                </ArtifactExplorerMenu>
            </div>
        </div>

        <template #footer>
            <div class="flex w-full items-center justify-between">
                <Button
                    label="Cancel"
                    text
                    size="small"
                    @click="$emit('cancel')"
                    :disabled="loading"
                    severity="secondary"
                />

                <Button
                    label="Commit"
                    text
                    size="small"
                    @click="$emit('commit')"
                    :disabled="!isAuthenticated || loading"
                />
            </div>
        </template>
    </Dialog>
</template>

<style scoped></style>
