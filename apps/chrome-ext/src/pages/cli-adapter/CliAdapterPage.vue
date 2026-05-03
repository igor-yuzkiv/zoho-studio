<script setup lang="ts">
const socket = new WebSocket(import.meta.env.VITE_CLI_AGENT_WS_URL)


socket.onopen = () => {
    console.log('WebSocket connection established')
    socket.send(JSON.stringify({ type: 'greet', payload: 'Hello from the CLI Adapter!' }))
}
</script>

<template>
    <div class="app-card flex h-full w-full flex-col items-center justify-center overflow-hidden"></div>
</template>

<style scoped></style>
