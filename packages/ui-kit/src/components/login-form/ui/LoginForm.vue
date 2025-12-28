<script setup lang="ts">
import { FieldContainer } from '../../form'
import { reactive } from 'vue'
import { Button, InputText, Message, Password } from 'primevue'

type LoginFormModel = { email: string; password: string }

const emit = defineEmits<{ (event: 'submit', value: LoginFormModel): void }>()
defineProps<{
    errorMessage?: string
    isLoading?: boolean
}>()

const formData = defineModel<LoginFormModel>({ default: { email: '', password: '' } })
const validationErrors = reactive({ email: '', password: '' })

function validate(): boolean {
    validationErrors.email = formData.value.email ? '' : 'Email is required.'
    validationErrors.password = formData.value.password ? '' : 'Password is required.'

    return !validationErrors.email && !validationErrors.password
}

function handleClickSignIn() {
    if (!validate()) {
        return
    }

    emit('submit', { ...formData.value })
}
</script>

<template>
    <div class="flex flex-col">
        <h1 class="text-2xl font-bold">Sign In</h1>

        <div class="flex flex-col gap-2 mt-5">
            <FieldContainer label="Email" input-id="user_email" :error-message="validationErrors.email">
                <InputText fluid v-model="formData.email" type="email" :invalid="!!validationErrors.email" />
            </FieldContainer>

            <FieldContainer label="Password" input-id="password" :error-message="validationErrors.password">
                <Password fluid v-model="formData.password" :feedback="false" :invalid="!!validationErrors.password" />
            </FieldContainer>

            <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>

            <Button @click="handleClickSignIn" :disabled="isLoading">Sign In</Button>
        </div>
    </div>
</template>

<style scoped></style>
