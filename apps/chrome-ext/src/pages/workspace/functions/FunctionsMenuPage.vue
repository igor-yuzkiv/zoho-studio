<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useCurrentProvider } from '../../../composables'
import { useProviderCapabilityArtifactsQuery } from '../../../queries'
import { ArtifactExplorerMenu } from '../../../components/artifacts-explorer'
import { FunctionIcon } from '../../../components/function-icon'
import { AppRouteName } from '../../../app/router'
import type { IArtifact } from '@zoho-studio/core'

const route = useRoute()
const router = useRouter()
const { providerId } = useCurrentProvider()
const { data } = useProviderCapabilityArtifactsQuery(providerId, 'functions')

function onSelect(artifact: IArtifact<'functions'>) {
    router.push({
        name: AppRouteName.workspaceFunctions,
        params: { providerId: providerId.value, artifactId: artifact.id },
    })
}
</script>

<template>
    <ArtifactExplorerMenu
        :items="data"
        :active-id="route.params.artifactId as string"
        group-by="payload.type"
        @select="onSelect"
    >
        <template #item-icon="{ artifact }">
            <FunctionIcon :type="artifact.payload.type" />
        </template>
    </ArtifactExplorerMenu>
</template>
