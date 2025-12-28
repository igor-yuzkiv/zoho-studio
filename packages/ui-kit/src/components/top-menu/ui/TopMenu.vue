<script setup lang="ts">
import type { TopMenuProps } from '../types.ts'
import TopMenuItem from './TopMenuItem.vue'

defineProps<TopMenuProps>()
</script>

<template>
    <div class="relative flex w-full justify-between overflow-hidden p-1">
        <div class="flex items-center gap-x-2 shrink-0">
            <TopMenuItem
                v-for="item in items"
                :key="item.title"
                :is="item.route ? 'router-link' : 'div'"
                v-bind="item.route ? { to: item.route } : {}"
                class="app-list-item-hover"
                active-class="app-list-item-active"
                :title="item.title"
            />
        </div>

        <slot />

        <slot name="right-content"></slot>
    </div>
</template>

<style scoped></style>
