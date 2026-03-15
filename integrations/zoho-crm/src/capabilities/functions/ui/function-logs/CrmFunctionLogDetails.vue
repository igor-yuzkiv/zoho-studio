<script setup lang="ts">
import type { CrmFunctionLog } from '../../../../types'
import { DisplayField, JsonViewer, IconButton } from '@zoho-studio/ui-kit'
import Dialog from 'primevue/dialog'
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import { normalizeJsonDeep } from '@zoho-studio/utils'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanel from 'primevue/tabpanel'

const props = defineProps<{
    log: CrmFunctionLog
}>()

const isFullScreen = ref(false)

const functionArguments = computed(() => {
    if (!props.log.arguments) {
        return {}
    }

    return Object.fromEntries(
        Object.entries(props.log.arguments).map(([key, value]) => {
            if (typeof value === 'string') {
                return [key, normalizeJsonDeep(value)]
            }

            return [key, value]
        })
    )
})

const infoMessages = computed(() => {
    if (!props.log.info_message) {
        return []
    }

    return props.log.info_message.map((message) => {
        if (typeof message === 'string') {
            return normalizeJsonDeep(message)
        }

        return { message }
    })
})
</script>

<template>
    <Dialog content-class=""></Dialog>
    <component
        :is="isFullScreen ? Dialog : 'div'"
        :class="[
            'flex flex-col overflow-hidden',
            isFullScreen ? 'bg-primary h-[95vh] w-[98%] border-none' : 'h-full w-full',
        ]"
        content-class="felx flex-col h-full w-full overflow-hidden"
        v-model:visible="isFullScreen"
        :modal="true"
        :show-header="false"
    >
        <Tabs value="overview" class="flex h-full w-full flex-col overflow-hidden">
            <div class="flex flex-col">
                <div class="flex items-center justify-between px-2">
                    <div class="flex flex-wrap items-center gap-x-3">
                        <div class="flex items-center gap-x-1">
                            <Icon icon="tabler:activity" class="h-6 w-6" />
                            <h2 class="text-lg font-bold">{{ log.function_name }}</h2>
                        </div>

                        <div class="flex items-center gap-x-1 text-gray-500">
                            <Icon icon="humbleicons:calendar" class="h-4 w-4" />
                            <span>{{ log.executed_time }}</span>
                        </div>

                        <div class="flex items-center gap-x-1 text-gray-500">
                            <Icon icon="fluent:timer-16-regular" class="h-4 w-4" />
                            <span>{{ log.execution_time }}</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-x-1">
                        <IconButton
                            text
                            severity="secondary"
                            :icon="isFullScreen ? 'material-symbols:close-rounded' : 'flowbite:expand-outline'"
                            @click="isFullScreen = !isFullScreen"
                        />
                    </div>
                </div>

                <TabList class="bg-transparent">
                    <Tab class="px-3 py-1" value="overview">Overview</Tab>
                    <Tab class="px-3 py-1" value="arguments">Arguments</Tab>
                    <Tab class="px-3 py-1" value="info_messages">Info Messages</Tab>
                    <Tab class="px-3 py-1" value="raw">Raw</Tab>
                </TabList>
            </div>

            <TabPanel value="overview" class="overflow-hidden">
                <div class="grid gap-4 p-3 md:grid-cols-2">
                    <DisplayField label="id" :value="log.id" />
                    <DisplayField label="status" :value="log.status" />
                    <DisplayField label="function_name" :value="log.function_name" />
                    <DisplayField label="component_type" :value="log.component_type ?? 'N/A'" />
                    <DisplayField label="start_datetime" :value="log.start_datetime ?? 'N/A'" />
                    <DisplayField label="end_datetime" :value="log.end_datetime ?? 'N/A'" />
                    <DisplayField label="execution_time" :value="log.execution_time ?? 'N/A'" />
                    <DisplayField label="info_messages" :value="log.info_message?.length" />
                </div>
            </TabPanel>

            <TabPanel value="arguments" class="overflow-hidden">
                <JsonViewer
                    :data="functionArguments"
                    :depth="5"
                    class="h-full w-full overflow-hidden"
                    title="Arguments"
                    content-class="bg-mine-shaft-100 dark:bg-mine-shaft-800 overflow-auto"
                />
            </TabPanel>

            <TabPanel value="info_messages" class="overflow-hidden">
                <JsonViewer
                    :data="infoMessages"
                    :depth="5"
                    class="h-full w-full overflow-hidden"
                    title="Info Messages"
                    content-class="bg-mine-shaft-100 dark:bg-mine-shaft-800 overflow-auto"
                />
            </TabPanel>

            <TabPanel value="raw" class="overflow-hidden">
                <JsonViewer
                    :data="log"
                    :depth="5"
                    class="h-full w-full overflow-hidden"
                    title="Raw"
                    content-class="bg-mine-shaft-100 dark:bg-mine-shaft-800 overflow-auto"
                />
            </TabPanel>
        </Tabs>
    </component>
</template>

<style scoped></style>
