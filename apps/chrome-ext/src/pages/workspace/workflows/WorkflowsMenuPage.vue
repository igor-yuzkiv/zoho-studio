<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useCurrentProvider } from '../../../composables'
import { useCapabilityArtifactsListQuery } from '../../../queries'
import { ArtifactExplorerMenu } from '../../../components/artifacts-explorer'
import { AppRouteName } from '../../../app/router'
import type { IArtifact } from '@zoho-studio/core'

const route = useRoute()
const router = useRouter()
const { providerId } = useCurrentProvider()
const { data } = useCapabilityArtifactsListQuery(providerId, 'workflows')

function onSelect(artifact: IArtifact<'workflows'>) {
    router.push({
        name: AppRouteName.workspaceWorkflow,
        params: { providerId: providerId.value, artifactId: artifact.id },
    })
}
</script>

<template>
    <ArtifactExplorerMenu
        :items="data"
        :active-id="route.params.artifactId as string"
        icon="mdi:workflow"
        group-by="payload.module_api_name"
        @select="onSelect"
    />
</template>
