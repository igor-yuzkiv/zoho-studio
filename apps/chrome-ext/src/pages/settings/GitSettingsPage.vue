<script setup lang="ts">
import { useGitStore } from '../../store'
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'
import {
    GitGlobalConfigForm,
    GitRepositoriesTable,
    type IGitRepository,
    AddGitRepositoryDialog,
} from '../../shared/git'
import { ref } from 'vue'

const gitStore = useGitStore()

const isVisibleAddRepoDialog = ref(false)

function handleAddedRepository(newRepo: IGitRepository) {
    gitStore.addRepository(newRepo)
    isVisibleAddRepoDialog.value = false
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

                            <Button size="small" text @click="isVisibleAddRepoDialog = true">Add</Button>
                        </div>
                    </template>
                    <template #toggleicon="{ collapsed }">
                        <Icon :icon="collapsed ? 'famicons:chevron-up' : 'famicons:chevron-down'" />
                    </template>

                    <GitRepositoriesTable :repositories="gitStore.repositories" />
                </Panel>
            </div>
        </div>

        <AddGitRepositoryDialog v-model:visible="isVisibleAddRepoDialog" @created="handleAddedRepository" />
    </div>
</template>

<style scoped></style>
