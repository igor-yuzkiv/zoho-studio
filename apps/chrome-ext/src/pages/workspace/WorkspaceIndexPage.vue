<script setup lang="ts">
import Button from 'primevue/button'
import { useArtifactsFetcher, useCurrentProvider } from '../../composables'

const currentProvider = useCurrentProvider()
const fetcher = useArtifactsFetcher()

async function test() {
    if (!currentProvider.provider.value) {
        return
    }

    const artifactsPerCap = await fetcher.fetchProviderArtifacts(currentProvider.provider.value, currentProvider.providerCapabilities.value)
    console.log(artifactsPerCap);
}
</script>

<template>
    <div class="app-card flex h-full w-full items-center justify-center">
        <Button @click="test">Test</Button>
    </div>
</template>

<style scoped></style>
