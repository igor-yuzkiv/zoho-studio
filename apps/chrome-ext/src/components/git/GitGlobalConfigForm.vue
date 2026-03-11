<script setup lang="ts">
import Message from 'primevue/message'
import InputText from 'primevue/inputtext'

const userName = defineModel<string | null>('userName')
const userEmail = defineModel<string | null>('userEmail')
</script>

<template>
    <div class="flex flex-col">
        <div class="flex flex-col">
            <label class="font-bold" for="user_name">User Name</label>
            <InputText
                id="user_name"
                aria-describedby="user_name-help"
                size="small"
                placeholder="git config --global user.name 'Your Name'"
                v-model.trim.lazy="userName"
            />
            <Message size="small" severity="secondary" variant="simple">
                Enter the name you want to associate with your Git commits.
            </Message>
        </div>

        <div class="flex flex-col">
            <label class="font-bold" for="user_email">User Email</label>
            <InputText
                id="user_email"
                aria-describedby="user_email-help"
                size="small"
                type="email"
                placeholder="git config --global user.email 'your@mail.com'"
                v-model.trim.lazy="userEmail"
            />
            <Message size="small" severity="secondary" variant="simple">
                Enter the email you want to associate with your Git commits.
            </Message>
        </div>
    </div>
</template>

<style scoped></style>
