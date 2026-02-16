<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useCurrentProvider } from '../../../composables'
import { useProviderCapabilityArtifactsQuery } from '../../../queries'
import { ArtifactExplorerMenu } from '../../../components/artifacts-explorer'
import { AppRouteName } from '../../../app/router'
import { useRouteParams } from '@vueuse/router'
import type { CapabilityType, IArtifact } from '@zoho-studio/core'
import { computed } from 'vue'
import type { Component } from 'vue'
import { FunctionIcon } from '../../../components/function-icon'

type ArtifactMenuConfig = {
    groupBy: string
    icon?: string
    iconComponent?: Component
}

const artifactMenuConfigMap: Partial<Record<CapabilityType, ArtifactMenuConfig>> = {
    functions: { groupBy: 'payload.type', iconComponent: FunctionIcon },
    modules: { groupBy: 'payload.module_type', icon: 'streamline-sharp:module' },
    workflows: { groupBy: 'payload.module_api_name', icon: 'mdi:workflow' },
}


const route = useRoute()
const router = useRouter()
const { providerId } = useCurrentProvider()
const capabilityType = useRouteParams<CapabilityType>('capabilityType')

const { data } = useProviderCapabilityArtifactsQuery(providerId, capabilityType)

const menuConfig = computed(() => artifactMenuConfigMap[capabilityType.value])

function onSelect(artifact: IArtifact) {
    router.push({
        name: AppRouteName.workspaceArtifact,
        params: { providerId: providerId.value, capabilityType: capabilityType.value, artifactId: artifact.id },
    })
}
</script>

<template>
    <ArtifactExplorerMenu
        :items="data"
        :active-id="route.params.artifactId as string"
        :group-by="menuConfig?.groupBy"
        :icon="menuConfig?.icon"
        @select="onSelect"
    >
        <template v-if="menuConfig?.iconComponent" #item-icon="{ artifact }">
            <component :is="menuConfig.iconComponent" :type="(artifact.payload as any).type" />
        </template>
    </ArtifactExplorerMenu>
</template>
