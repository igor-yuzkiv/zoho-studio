<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { useGitGlobalConfigStore } from '../../store'

const remoteServerUrl = import.meta.env.VITE_GIT_REMOTE_SERVER_URL
const gitConfig = useGitGlobalConfigStore()
</script>

<template>
    <div class="app-card flex h-full w-full overflow-hidden">
        <div class="container mx-auto flex h-full flex-col overflow-hidden p-2">
            <div class="flex items-center justify-between border-b">
                <h1 class="text-lg font-bold">Git Config</h1>
            </div>

            <div class="mt-1 mt-3 flex h-full w-full flex-col gap-3 overflow-auto">
                <div class="flex flex-col">
                    <label class="font-bold" for="user_name">Remote Server</label>
                    <InputText
                        id="remote_server_url"
                        aria-describedby="remote_server_url-help"
                        size="small"
                        placeholder="https://example.com"
                        :value="remoteServerUrl"
                        readonly
                        disabled
                    />
                </div>

                <div class="flex flex-col">
                    <label class="font-bold" for="user_name">User Name</label>
                    <InputText
                        id="user_name"
                        aria-describedby="user_name-help"
                        size="small"
                        placeholder="git config --global user.name 'Your Name'"
                        v-model.trim.lazy="gitConfig.gitUserName"
                    />
                    <Message size="small" severity="secondary" variant="simple">
                        Enter the name you want to associate with your Git commits.
                    </Message>
                </div>

                <div class="flex flex-col">
                    <label class="font-bold" for="user_email">User Email</label>
                    <InputText
                        id="user_email"
                        aria-describedby="user_email-help"
                        size="small"
                        type="email"
                        placeholder="git config --global user.email 'your@mail.com'"
                        v-model.trim.lazy="gitConfig.gitUserEmail"
                    />
                    <Message size="small" severity="secondary" variant="simple">
                        Enter the email you want to associate with your Git commits.
                    </Message>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
