<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { useArtifactByIdQuery } from '../../../queries'

const artifactId = useRouteParams<string>('artifactId')
const { data } = useArtifactByIdQuery<'workflows'>(artifactId)
</script>

<template>
    <div class="app-card flex h-full w-full flex-col overflow-auto">
        <pre>{{ data }}</pre>
    </div>
</template>
