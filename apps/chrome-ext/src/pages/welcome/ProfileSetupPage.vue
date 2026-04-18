<script setup lang="ts">
import { AppRouteName } from '../../app/router'
import { useAppStore } from '../../store'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const appStore = useAppStore()

const profileName = ref('')
const profileId = ref(globalThis.crypto.randomUUID())
const isContinueDisabled = computed(() => profileName.value.trim().length === 0)

function handleSubmit() {
    const normalizedProfileName = profileName.value.trim()

    if (!normalizedProfileName) {
        return
    }

    appStore.setProfile({
        id: profileId.value,
        name: normalizedProfileName,
    })

    void router.replace({ name: AppRouteName.home })
}
</script>

<template>
    <div class="flex h-full w-full items-center justify-center overflow-hidden px-4 py-6">
        <div class="app-card w-full max-w-2xl overflow-hidden p-6 md:p-8">
            <div class="mb-8">
                <p class="text-sm font-medium uppercase tracking-[0.2em] text-primary-500">Step 2 of 2</p>
                <h1 class="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">Profile Setup</h1>
                <p class="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                    Create a local profile to unlock the extension. This profile is stored only on this device.
                </p>
            </div>

            <form class="space-y-5" @submit.prevent="handleSubmit">
                <div class="flex flex-col gap-2">
                    <label for="profile-name" class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Profile Name
                    </label>
                    <InputText
                        id="profile-name"
                        v-model="profileName"
                        fluid
                        autofocus
                        autocomplete="off"
                        placeholder="Enter profile name"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="profile-id" class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Profile ID
                    </label>
                    <InputText id="profile-id" :model-value="profileId" fluid readonly />
                </div>

                <div class="flex justify-end pt-2">
                    <Button type="submit" label="Continue" :disabled="isContinueDisabled" />
                </div>
            </form>
        </div>
    </div>
</template>
