<script setup lang="ts">
import { useCurrentProvider } from '../../composables'
import { Icon } from '@iconify/vue'

const { providerManifest } = useCurrentProvider()
</script>

<template>
    <div class="app-card flex h-full w-full items-center justify-center">
        <div v-if="providerManifest" class="flex flex-col p-3">
            <div class="flex flex-col">
                <h3 class="text-gray-700 dark:text-gray-400">Service Provider</h3>
                <div class="flex items-center gap-x-2 text-2xl">
                    <Icon :icon="providerManifest.icon" />
                    <h1 class="font-bold">{{ providerManifest.displayName }}</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
