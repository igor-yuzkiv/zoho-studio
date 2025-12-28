<script setup lang="ts">
import { Skeleton } from 'primevue'
</script>

<template>
    <div class="flex items-center justify-between bg-primary p-1 rounded-lg px-2">
        <div class="flex flex-col gap-1 w-full">
            <Skeleton height="1.3rem" width="30%"></Skeleton>
            <Skeleton height="1rem" width="50%"></Skeleton>
        </div>

        <div class="flex items-center gap-x-1">
            <Skeleton height="2rem" width="4rem"></Skeleton>
            <Skeleton height="2rem" width="4rem"></Skeleton>
        </div>
    </div>
</template>

<style scoped></style>
