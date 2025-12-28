import { usePreferredDark, useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useAppThemeStore = defineStore('shared.appAppTheme', () => {
    const currenTheme = useStorage('theme', '')
    const isDarkPreferred = usePreferredDark()
    const isDark = computed(() => currenTheme.value === 'dark')

    function setClass(value: string) {
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(value)
    }

    function toggle() {
        const next = isDark.value ? 'light' : 'dark'
        currenTheme.value = next
        setClass(next)
    }

    function initialize() {
        let theme = currenTheme.value
        if (!theme) {
            theme = isDarkPreferred.value ? 'dark' : 'light'
        }

        currenTheme.value = theme
        setClass(theme)
    }

    return { isDark, toggle, initialize }
})
