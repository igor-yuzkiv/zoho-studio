<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
    <div class="app-card flex h-full w-full items-center justify-center">
        <template v-if="route.params.artifactId">
            <span>Artifact ID: {{ route.params.artifactId }}</span>
        </template>
        <template v-else>
            <span class="text-muted-color">Select a workflow</span>
        </template>
    </div>
</template>
