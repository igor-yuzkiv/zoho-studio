<script setup lang="ts" generic="T extends Record<string, unknown>">
import { ListItemProps } from '../lib/list.props.ts'
import ListItem from './ListItem.vue'
import { onKeyStroke, useFocusWithin } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'
import InputText from 'primevue/inputtext'

const emit = defineEmits<{
    (e: 'itemClick', item: T): void
    (e: 'loadMore'): void
    (e: 'selectItem', item: T): void
}>()
const props = withDefaults(
    defineProps<{
        items: T[]
        itemKey?: string
        itemTitle?: string
        itemIcon?: string
        searchStrategy?: 'internal' | 'external'
        searchFields?: string[]
        searchPlaceholder?: string
        tooltipField?: keyof T
        listItemProps?: Partial<ListItemProps>
        isActiveItem?: (item: T) => boolean
        hasMoreItems?: boolean
        keyboardNavigationEnabled?: boolean
    }>(),
    {
        itemKey: 'id',
        itemTitle: 'title',
        itemIcon: 'icon-park-outline:dot',
        searchPlaceholder: 'Start typing to search...',
        searchFields: () => ['title'],
        hasMoreItems: false,
        keyboardNavigationEnabled: true,
    }
)

const listContainer = useTemplateRef('list-container')
const searchTerm = defineModel<string>('search-term', { default: '' })
const activeItemIndex = computed(() => itemsForDisplay.value.findIndex((item) => item.isActive))
const { focused: isFocused } = useFocusWithin(listContainer)
const isKeyboardNavigationAllowed = computed(() => props.keyboardNavigationEnabled && isFocused.value)

const getItemFilterValue = (item: T): string => {
    if (!props.searchFields || props.searchFields.length === 0) {
        return ''
    }

    return props.searchFields
        .map((field) => item[field] || '')
        .join(' ')
        .toLowerCase()
        .trim()
}

const mapItem = (item: T) => {
    const title = String(item[props.itemTitle])

    const isActive = props.isActiveItem ? props.isActiveItem(item) : false

    return {
        original: item,
        key: String(item[props.itemKey]),
        title: title,
        tooltip: props.tooltipField ? String(item[props.tooltipField]) : title,
        searchValue: getItemFilterValue(item),
        isActive,
    }
}

const mappedItems = computed(() => props.items.map((item) => mapItem(item)))

const itemsForDisplay = computed(() => {
    return props.searchStrategy === 'internal' && searchTerm.value
        ? mappedItems.value.filter((item) => item.searchValue.includes(searchTerm.value.toLowerCase().trim()))
        : mappedItems.value
})

onKeyStroke('ArrowUp', (e) => {
    if (isKeyboardNavigationAllowed.value && activeItemIndex.value > 0) {
        const previousItem = itemsForDisplay.value[activeItemIndex.value - 1]
        if (previousItem) {
            e.preventDefault()
            emit('selectItem', previousItem.original)
        }
    }
})

onKeyStroke('ArrowDown', (e) => {
    if (isKeyboardNavigationAllowed.value && activeItemIndex.value < itemsForDisplay.value.length - 1) {
        const nextItem = itemsForDisplay.value[activeItemIndex.value + 1]
        if (nextItem) {
            e.preventDefault()
            emit('selectItem', nextItem.original)
        }
    }
})
</script>

<template>
    <div class="flex h-full flex-col overflow-x-hidden overflow-y-auto" ref="list-container" tabindex="0">
        <div v-if="searchStrategy" class="flex items-center gap-x-2 border-b">
            <InputText
                v-model.lazy="searchTerm"
                size="small"
                class="w-full bg-primary rounded-none border-none shadow-none"
                :placeholder="searchPlaceholder"
            />

            <slot name="search-extra" />
        </div>

        <div class="flex h-full flex-col overflow-x-hidden overflow-y-auto">
            <ul v-if="itemsForDisplay.length" class="w-full">
                <li v-for="item in itemsForDisplay" :key="item.key">
                    <slot name="item" :item="item.original" :active="item.isActive">
                        <ListItem
                            @click="$emit('itemClick', item.original)"
                            :title="item.title"
                            :icon="itemIcon"
                            :tooltip="item.tooltip"
                            v-bind="listItemProps"
                        />
                    </slot>
                </li>
            </ul>

            <slot v-else name="empty">
                <div class="flex h-full w-full items-center justify-center p-4 app-secondary-text">No items found.</div>
            </slot>
        </div>

        <div
            v-if="hasMoreItems"
            @click="$emit('loadMore')"
            class="text-center w-full cursor-pointer rounded text-gray-400 hover:text-black dark:hover:text-white"
        >
            Load More
        </div>
    </div>
</template>

<style scoped></style>
