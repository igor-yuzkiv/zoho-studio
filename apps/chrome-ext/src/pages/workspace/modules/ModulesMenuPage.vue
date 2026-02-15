<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useCurrentProvider } from '../../../composables'
import { useProviderCapabilityArtifactsQuery } from '../../../queries'
import { ArtifactExplorerMenu } from '../../../components/artifacts-explorer'
import { AppRouteName } from '../../../app/router'
import type { IArtifact } from '@zoho-studio/core'

const route = useRoute()
const router = useRouter()
const { providerId } = useCurrentProvider()
const { data } = useProviderCapabilityArtifactsQuery(providerId, 'modules')

function onSelect(artifact: IArtifact<'modules'>) {
    router.push({
        name: AppRouteName.workspaceMetadata,
        params: { providerId: providerId.value, artifactId: artifact.id },
    })
}
</script>

<template>
    <ArtifactExplorerMenu
        :items="data"
        :active-id="route.params.artifactId as string"
        icon="streamline-sharp:module"
        @select="onSelect"
    />
</template>
