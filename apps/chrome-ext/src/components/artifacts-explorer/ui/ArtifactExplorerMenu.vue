<script setup lang="ts" generic="TCapabilityType extends CapabilityType = CapabilityType">
import type { ArtifactId, CapabilityType, IArtifact } from '@zoho-studio/core'
import { computed, ref } from 'vue'
import type { ArtifactGroup, ArtifactGroupBy } from '../types.ts'
import ArtifactExplorerMenuItem from './ArtifactExplorerMenuItem.vue'
import { Icon } from '@iconify/vue'
import { get } from 'lodash'

const props = withDefaults(
    defineProps<{
        items: IArtifact<TCapabilityType>[]
        groupBy: ArtifactGroupBy
        activeId?: ArtifactId
        icon?: string
    }>(),
    {
        groupBy: null,
    }
)

const emit = defineEmits<{
    (e: 'update:activeId', value?: ArtifactId): void
    (e: 'select', artifact: IArtifact<TCapabilityType>): void
}>()

defineSlots<{
    'item-icon': (props: { artifact: IArtifact<TCapabilityType> }) => any
}>()

const collapsedGroups = ref<Record<string, boolean>>({})

function getGroupKey(artifact: IArtifact): string {
    if (typeof props.groupBy === 'function') {
        return String(props.groupBy(artifact) ?? 'Other')
    } else if (typeof props.groupBy === 'string') {
        return String(get(artifact, props.groupBy) ?? 'Other')
    }

    return 'Other'
}

const groupedItems = computed<ArtifactGroup<TCapabilityType>[] | null>(() => {
    if (!props.groupBy) {
        return null
    }

    const groupsMap = props.items.reduce((map, artifact) => {
        const key = getGroupKey(artifact)
        const existing = map.get(key)

        if (existing) {
            existing.push(artifact)
        } else {
            map.set(key, [artifact])
        }

        return map
    }, new Map<string, IArtifact<TCapabilityType>[]>())

    return Array.from(groupsMap.entries()).map(([key, items]) => ({
        key,
        title: key,
        items,
    }))
})

function toggleGroup(key: string) {
    collapsedGroups.value = {
        ...collapsedGroups.value,
        [key]: !collapsedGroups.value[key],
    }
}

function handleSelect(artifact: IArtifact<TCapabilityType>) {
    emit('update:activeId', artifact.id)
    emit('select', artifact)
}
</script>

<template>
    <div class="flex h-full w-full flex-col overflow-hidden">
        <div v-if="groupedItems" class="flex flex-col gap-y-2 overflow-auto">
            <section v-for="group in groupedItems" :key="group.key" class="px-1">
                <button
                    type="button"
                    class="flex w-full items-center gap-x-1 px-2 py-1 font-semibold uppercase"
                    @click="toggleGroup(group.key)"
                >
                    <Icon
                        icon="mdi:chevron-down"
                        class="h-4 w-4"
                        :class="collapsedGroups[group.key] ? '-rotate-90' : ''"
                    />

                    <span class="truncate">{{ group.title }}</span>
                </button>

                <div v-show="!collapsedGroups[group.key]" class="flex flex-col">
                    <ArtifactExplorerMenuItem
                        v-for="artifact in group.items"
                        :key="artifact.id"
                        :artifact="artifact"
                        :active="artifact.id === activeId"
                        :icon="icon"
                        @select="handleSelect"
                    >
                        <template v-if="$slots['item-icon']" #icon>
                            <slot name="item-icon" :artifact="artifact" />
                        </template>
                    </ArtifactExplorerMenuItem>
                </div>
            </section>
        </div>

        <div v-else class="flex flex-col overflow-auto">
            <ArtifactExplorerMenuItem
                v-for="artifact in items"
                :key="artifact.id"
                :artifact="artifact"
                :active="artifact.id === activeId"
                :icon="icon"
                @select="handleSelect"
            >
                <template v-if="$slots['item-icon']" #icon>
                    <slot name="item-icon" :artifact="artifact" />
                </template>
            </ArtifactExplorerMenuItem>
        </div>
    </div>
</template>

<style scoped></style>
