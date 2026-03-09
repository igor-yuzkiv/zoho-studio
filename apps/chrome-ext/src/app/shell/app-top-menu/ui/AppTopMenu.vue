<script setup lang="ts">
import { computed } from 'vue'
import { AppRouteName } from '../../../router'
import { useCurrentProvider } from '../../../../composables'
import { Icon } from '@iconify/vue'
import Menubar from 'primevue/menubar'
import type { MenuItem } from 'primevue/menuitem'
import type { RouteLocationRaw } from 'vue-router'
import { useProvidersRuntimeStore } from '../../../../store'
import { storeToRefs } from 'pinia'

type AppMenuItem = MenuItem & { route?: RouteLocationRaw }

const { provider } = useCurrentProvider()

const providersStore = useProvidersRuntimeStore()
const { providersList } = storeToRefs(providersStore)

const menuItems = computed<AppMenuItem[]>(() => {
    const result: AppMenuItem[] = [
        {
            label: 'Home',
            route: { name: AppRouteName.home },
        },
        {
            label: 'Git',
            items: [
                { label: 'Config', route: { name: AppRouteName.gitConfig } },
                { label: 'Init', disabled: !provider.value },
                { label: 'Commit', disabled: !provider.value },
            ],
        },
    ]

    if (providersList.value.length) {
        result.push({
            label: 'Services',
            items: providersList.value.map((p) => {
                return {
                    label: p.title,
                    route: { name: AppRouteName.workspaceIndex, params: { providerId: p.id } },
                }
            }),
        })
    }

    return result
})
</script>

<template>
    <div class="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-x-2 px-0 py-0.5">
        <Menubar
            :model="menuItems"
            class="m-0 rounded-none border-none bg-transparent p-0 shadow-none"
            :pt="{ itemLink: { class: 'py-0.5 px-2 rounded-lg hover:bg-primary hover:underline' } }"
        >
            <template #start>
                <slot name="start" />
            </template>
            <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span>{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                    <span>{{ item.label }}</span>
                </a>
            </template>
        </Menubar>

        <div
            class="trucate bg-primary flex max-w-96 min-w-64 cursor-pointer items-center justify-center gap-x-2 truncate rounded-lg border px-2 py-0.5 text-xs hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-black/60"
        >
            <Icon class="h-4 w-4" icon="material-symbols:search" />
            <span class="w-full truncate text-center">{{ provider?.title ?? 'Search' }}</span>
        </div>

        <div class="flex items-center justify-end gap-x-1">
            <slot name="end" />
        </div>
    </div>
</template>

<style scoped></style>
