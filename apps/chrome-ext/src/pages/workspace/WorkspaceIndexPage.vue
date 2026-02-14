<script setup lang="ts">
import Button from 'primevue/button'
import { useCurrentProvider } from '../../composables'
import { useArtifactsSync } from '../../composables'
import { useCapabilityArtifactsListQuery } from '../../queries'

const { provider, providerId } = useCurrentProvider()
const { syncProviderArtifacts } = useArtifactsSync()

const { data } = useCapabilityArtifactsListQuery(providerId, 'functions')

async function test() {
    if (provider.value) {
        await syncProviderArtifacts(provider.value)
    }
}
</script>

<template>
    <div class="app-card flex h-full w-full items-center justify-center">
        <Button @click="test">Test</Button>

        <div>
            <ul>
                <li v-for="item in data" :key="item.id">
                    {{ item.display_name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped></style>
