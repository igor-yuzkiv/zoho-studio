<script setup lang="ts">
import { useGitConfigStore } from '../../store'
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'
import { GitGlobalConfigForm, GitRepositoriesTable, AddGitRepositoryDialog } from '../../components/git'
import { ref } from 'vue'
import { useToast } from '@zoho-studio/ui-kit'
import { storeToRefs } from 'pinia'
import { useAddGitRepository } from '../../composables'
import { useConsoleLogger } from '@zoho-studio/utils'
import { ZodError } from 'zod'

const logger = useConsoleLogger('GitSettingsPage')
const toast = useToast()
const gitStore = useGitConfigStore()
const { isAuthenticated } = storeToRefs(gitStore)

const isVisibleAddRepoDialog = ref(false)
const addRepo = useAddGitRepository()

function closeAddRepoDialog() {
    isVisibleAddRepoDialog.value = false
    addRepo.resetForm()
}

function openAddRepoDialog() {
    isVisibleAddRepoDialog.value = true
}

async function handleAddRepository() {
    try {
        const newRepo = await addRepo.submitNewRepository()
        if (!newRepo.name) {
            toast.error({ detail: 'Failed to create repository. Please try again.' })
            return
        }

        gitStore.addRepository(newRepo)
        toast.success({ detail: 'Repository created successfully.' })
        closeAddRepoDialog()
    } catch (error) {
        logger.error('Failed to add repository:', error)

        if (error instanceof ZodError) {
            const [first, ...rest] = error.issues
            if (!first) {
                toast.error({ detail: 'Validation failed. Please check your input and try again.' })
                return
            }

            const errorMessage = rest.length > 0 ? `${first.message} (and ${rest.length} more errors)` : first.message

            toast.error({ detail: errorMessage })
        } else {
            toast.error({ detail: 'Something went wrong try again.' })
        }
    }
}
</script>

<template>
    <div class="app-card flex h-full w-full overflow-hidden">
        <div class="container mx-auto flex h-full flex-col overflow-hidden p-2 xl:max-w-4xl">
            <div class="flex items-center justify-between border-b">
                <h1 class="text-3xl font-bold">Git Config</h1>
            </div>

            <div class="mt-2 flex h-full w-full flex-col gap-5 overflow-auto">
                <!--Global Config-->
                <Panel
                    class="border-none bg-transparent"
                    header="Global Config"
                    :pt="{
                        content: { class: 'p-0' },
                        header: { class: 'p-0 text-lg font-bold' },
                    }"
                    toggleable
                >
                    <template #toggleicon="{ collapsed }">
                        <Icon :icon="collapsed ? 'famicons:chevron-up' : 'famicons:chevron-down'" />
                    </template>

                    <GitGlobalConfigForm
                        v-model:user-name="gitStore.gitUserName"
                        v-model:user-email="gitStore.gitUserEmail"
                    />
                </Panel>

                <!--Repositories-->
                <Panel
                    class="border-none bg-transparent"
                    header="Repositories"
                    :pt="{
                        content: { class: 'p-0' },
                        header: { class: 'p-0' },
                    }"
                    toggleable
                >
                    <template #header>
                        <div class="flex w-full items-center justify-between">
                            <h1 class="text-lg font-bold">Repositories</h1>

                            <Button size="small" text @click="openAddRepoDialog">Add</Button>
                        </div>
                    </template>
                    <template #toggleicon="{ collapsed }">
                        <Icon :icon="collapsed ? 'famicons:chevron-up' : 'famicons:chevron-down'" />
                    </template>

                    <GitRepositoriesTable :repositories="gitStore.repositories" />
                </Panel>
            </div>
        </div>

        <AddGitRepositoryDialog
            v-model:visible="isVisibleAddRepoDialog"
            v-model:repository-name="addRepo.repositoryName.value"
            v-model:repository-description="addRepo.repositoryDescription.value"
            :is-authenticated="isAuthenticated"
            :loading="addRepo.loading.value"
            @submit="handleAddRepository"
            @cancel="closeAddRepoDialog"
        />
    </div>
</template>

<style scoped></style>
