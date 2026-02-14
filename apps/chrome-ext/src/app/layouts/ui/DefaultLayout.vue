<script setup lang="ts">
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import { useRoute } from 'vue-router'
import { AppFooter } from '../../shell/app-footer'
import { AppHeader } from '../../shell/app-header'

const route = useRoute()
</script>

<template>
    <div class="relative bg-secondary flex h-screen w-full flex-col overflow-hidden">
        <AppHeader />

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
                    v-if="!route.meta?.hideSidebarMenu"
                    class="flex h-full overflow-hidden w-full"
                    :size="5"
                    style="min-width: 10rem; max-width: 50rem"
                >
                    <div class="flex flex-col w-full h-full overflow-hidden app-card">
                        <router-view name="menu" />
                    </div>
                </SplitterPanel>
                <SplitterPanel class="flex flex-col w-full h-full overflow-hidden">
                    <router-view />
                </SplitterPanel>
            </Splitter>
        </main>

        <AppFooter />
    </div>
</template>

<style scoped></style>
