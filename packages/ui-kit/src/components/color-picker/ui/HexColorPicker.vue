<script setup lang="ts">
import { useAppThemeStore } from '../../../useAppThemeStore.ts'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

withDefaults(defineProps<{ shape?: 'circle' | 'square' }>(), { shape: 'circle' })
const modelValue = defineModel({ type: String, default: '#ffffff' })

const appTheme = useAppThemeStore()
</script>

<template>
    <ColorPicker
        v-model:pureColor="modelValue"
        format="hex"
        pickerType="chrome"
        lang="En"
        shape="circle"
        :theme="appTheme.isDark ? 'black' : 'white'"
    />
</template>

<style scoped></style>
