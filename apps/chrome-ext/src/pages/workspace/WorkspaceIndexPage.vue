<script setup lang="ts">
import Button from 'primevue/button'
import { useCurrentProvider } from '../../composables'
import { useArtifactsSync } from '../../composables/use.artfacts-sync.ts'

const { provider } = useCurrentProvider()
const { syncProviderArtifacts } = useArtifactsSync()

async function test() {
    if (provider.value) {
        await syncProviderArtifacts(provider.value)
    }
}
</script>

<template>
    <div class="app-card flex h-full w-full items-center justify-center">
        <Button @click="test">Test</Button>
    </div>
</template>

<style scoped></style>
