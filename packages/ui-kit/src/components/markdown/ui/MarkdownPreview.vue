<script setup lang="ts">
import { useAppThemeStore } from '../../../useAppThemeStore.ts'
import { MdPreview } from 'md-editor-v3'
import { computed } from 'vue'

const appTheme = useAppThemeStore()
const props = withDefaults(
    defineProps<{
        content?: string
        emptyMessage?: string
    }>(),
    {
        emptyMessage: 'No content available.',
    }
)

const displayContent = computed(() => {
    return props.content && props.content.trim().length > 0 ? props.content : `_${props.emptyMessage}_`
})
</script>

<template>
    <MdPreview
        :modelValue="displayContent"
        :theme="appTheme.isDark ? 'dark' : 'light'"
        language="en-US"
        :codeFoldable="false"
        previewTheme="github"
        codeTheme="github"
    />
</template>

<style scoped></style>
