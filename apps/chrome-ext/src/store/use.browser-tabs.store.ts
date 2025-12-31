import { chromeBrowserService } from '../browser'
import { BrowserTab, BrowserTabId, BrowserTabRemoveEvent, BrowserTabUpdateEvent } from '@zoho-studio/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { onBeforeUnmount } from 'vue'

let stopWatchingTabs: (() => void) | null = null

export const useBrowserTabsStore = defineStore('browser.tabs', () => {
    const tabsMap = ref<Map<BrowserTabId, BrowserTab>>(new Map())
    const tabsList = computed(() => Array.from(tabsMap.value.values()))

    async function loadTabs() {
        const tabs = await chromeBrowserService.listTabs()
        tabsMap.value = new Map(tabs.map((tab) => [tab.id, tab]))
    }

    function handleTabUpdated(event: BrowserTabUpdateEvent) {
        if (!event.tab?.id) return

        const nextTabsMap = new Map(tabsMap.value)
        nextTabsMap.set(event.tab.id, event.tab)
        tabsMap.value = nextTabsMap
    }

    function handleTabRemoved(event: BrowserTabRemoveEvent) {
        if (!event.tabId) return

        const nextTabsMap = new Map(tabsMap.value)
        nextTabsMap.delete(event.tabId)
        tabsMap.value = nextTabsMap
    }

    async function initialize() {
        await loadTabs()

        if (!stopWatchingTabs) {
            stopWatchingTabs = chromeBrowserService.startWatchingTabs((event) => {
                if (event.type === 'updated') {
                    handleTabUpdated(event)
                } else if (event.type === 'removed') {
                    handleTabRemoved(event)
                }
            })
        }
    }

    onBeforeUnmount(() => {
        if (stopWatchingTabs) {
            stopWatchingTabs()
        }
    })

    return {
        initialize,
        tabsMap,
        loadTabs,
        tabsList,
    }
})
