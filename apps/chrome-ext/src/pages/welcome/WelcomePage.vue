<script setup lang="ts">
import { AppRouteName } from '../../app/router'
import { useSecurityRequirementsStore } from '../../store'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

const router = useRouter()
const securityRequirementsStore = useSecurityRequirementsStore()

function handleContinue() {
    securityRequirementsStore.acceptRequirements()

    void router.push({ name: AppRouteName.welcomeProfileSetup })
}
</script>

<template>
    <div class="flex h-full w-full items-center justify-center overflow-hidden px-4 py-6">
        <div class="app-card w-full max-w-3xl overflow-hidden p-6 md:p-8">
            <div class="mb-6 flex items-center justify-between gap-4">
                <div>
                    <p class="text-sm font-medium uppercase tracking-[0.2em] text-primary-500">Step 1 of 2</p>
                    <h1 class="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">Welcome to Zoho Studio</h1>
                </div>
                <img src="/logo.png" alt="Zoho Studio logo" class="h-12 w-12 shrink-0" />
            </div>

            <div class="space-y-4">
                <p class="text-sm leading-6 font-bold text-red-500">
                    This project is an independent, non-commercial developer tool and is not affiliated with,
                    endorsed by, or supported by Zoho. It is maintained as a personal project and may evolve over
                    time. Use it only in environments you are authorized to access and in accordance with your
                    organization's policies.
                </p>
                <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
                    <b class="text-primary-500">Zoho Studio</b> is a browser extension that adds a developer-oriented
                    workspace next to your Zoho tabs.
                </p>
                <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
                    It uses your current browser session and may rely on unofficial Zoho APIs.
                    <b>Please use this tool only in environments and with services you are authorized to access.</b>
                </p>
                <p class="text-sm leading-6 font-bold text-gray-900 dark:text-gray-100">
                    By continuing, you acknowledge how the extension works and accept responsibility for how it is used.
                </p>

                <a
                    href="https://github.com/igor-yuzkiv/zoho-studio"
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex hover:underline"
                >
                    <p class="text-sm leading-6 text-gray-700 dark:text-gray-300">
                        For more details, please refer to our <b class="text-primary-500">documentation</b>.
                    </p>
                </a>
            </div>

            <div class="mt-8 flex justify-end">
                <Button label="Continue" @click="handleContinue" />
            </div>
        </div>
    </div>
</template>
