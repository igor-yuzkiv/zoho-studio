<script setup lang="ts">
import { AppRouteName } from '../../../router'
</script>

<template>
    <div class="relative flex w-full justify-between overflow-hidden p-1">
        <div class="flex shrink-0 items-center gap-x-2">
            <router-link
                :to="{ name: AppRouteName.home }"
                class="hover:bg-primary rounded-lg px-3 hover:underline"
                active-class="app-list-item-active"
            >
                Home
            </router-link>
        </div>
    </div>
</template>

<style scoped></style>
