<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import { useArtifactByIdQuery, useArtifactsByParentIdQuery } from '../../../queries'

const artifactId = useRouteParams<string>('artifactId')
const { data: moduleDetails } = useArtifactByIdQuery<'modules'>(artifactId)
const { data: fields } = useArtifactsByParentIdQuery<'fields'>(artifactId)
</script>

<template>
    <div class="app-card flex h-full w-full flex-col overflow-auto">
        <h1 class="text-lg">{{ moduleDetails?.display_name }}</h1>
        <pre>{{ fields }}</pre>
    </div>
</template>
