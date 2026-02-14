<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { AppRouteName } from '../../app/router'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()

const errorCode = computed(() => (route.query.code as string) || '404')
const errorMessage = computed(() => (route.query.message as string) || 'Page not found')

function goHome() {
    router.push({ name: AppRouteName.home })
}
</script>

<template>
    <div class="flex h-full w-full items-center justify-center overflow-hidden">
        <div class="app-card flex h-full w-full items-center justify-center">
            <div class="flex flex-col items-center gap-y-4 p-6">
                <Icon icon="mdi:alert-circle-outline" class="h-32 w-32 text-gray-400" />

                <div class="flex flex-col items-center gap-y-1">
                    <h1 class="text-4xl font-bold">{{ errorCode }}</h1>
                    <p class="text-lg text-gray-700 dark:text-gray-400">{{ errorMessage }}</p>
                </div>

                <Button label="Go Home" severity="secondary" @click="goHome" />
            </div>
        </div>
    </div>
</template>
