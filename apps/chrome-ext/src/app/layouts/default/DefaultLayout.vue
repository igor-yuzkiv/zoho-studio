<script setup lang="ts">
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import { useRoute } from 'vue-router'
import { AppFooter } from '../../shell/app-footer'
import { AppTopMenu } from '../../shell/app-top-menu'
import { storeToRefs } from 'pinia'
import { useAppStateStore } from '../../../store'

const route = useRoute()

const { isLeftSidebarCollapsed } = storeToRefs(useAppStateStore())
</script>

<template>
    <div class="bg-secondary relative flex h-screen w-full flex-col overflow-hidden">
        <AppTopMenu />

        <main
            class="flex h-full w-full flex-col overflow-hidden px-2"
            :class="{
                'pt-2': route.meta?.hideTopbar,
                'pb-2': route.meta?.hideFooter,
            }"
        >
            <Splitter
                class="flex h-full w-full overflow-hidden bg-transparent"
                :pt="{ gutter: { class: 'bg-transparent' } }"
            >
                <SplitterPanel
                    v-if="!route.meta?.hideSidebarMenu && isLeftSidebarCollapsed"
                    class="flex h-full w-full overflow-hidden"
                    :size="5"
                    style="min-width: 10rem; max-width: 50rem"
                >
                    <div class="app-card flex h-full w-full flex-col overflow-hidden">
                        <router-view name="menu" />
                    </div>
                </SplitterPanel>
                <SplitterPanel class="flex h-full w-full flex-col overflow-hidden">
                    <router-view />
                </SplitterPanel>
            </Splitter>
        </main>

        <AppFooter />
    </div>
</template>

<style scoped></style>
