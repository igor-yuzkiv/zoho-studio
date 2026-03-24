<script setup lang="ts">
import { omit } from 'lodash'
import { useCurrentProvider } from '../../composables'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { ref, watch } from 'vue'
import { useConfirm, useToast } from '@zoho-studio/ui-kit'
import * as zod from 'zod'
import { UpdateProviderDto } from '@zoho-studio/core'
import { useRouter } from 'vue-router'
import { AppRouteName } from '../../app/router'

type FormData = {
    title: string
    cacheTtlInHours: number
    autoSyncEnabled: boolean
}

const formDataSchema = zod.object({
    title: zod.string().min(1, 'Title is required'),
    cacheTtlInHours: zod.number().min(1, 'Cache TTL must be at least 1 hour'),
    autoSyncEnabled: zod.boolean(),
})

const { provider, updateProvider } = useCurrentProvider()
const confirm = useConfirm()
const toast = useToast()
const router = useRouter()

const formData = ref<FormData>({
    title: '',
    cacheTtlInHours: 4,
    autoSyncEnabled: false,
})

async function saveProviderSettings() {
    if (!provider.value) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No provider selected' })
        return
    }

    const isConfirmed = await confirm.requireAsync({
        header: 'Confirm Save',
        message: 'Are you sure you want to save the provider settings?',
    })
    if (!isConfirmed) return

    try {
        const validatedData = formDataSchema.parse(formData.value)

        const payload: Partial<UpdateProviderDto> = {
            ...omit(validatedData, ['cacheTtlInHours']),
            cacheTtlInMs: validatedData.cacheTtlInHours * 60 * 60 * 1000,
        }

        updateProvider(payload)

        await router.push({ name: AppRouteName.workspaceIndex, params: { providerId: provider.value?.id } })
    } catch (error) {
        if (error instanceof zod.ZodError) {
            const [first, ...rest] = error.issues
            if (!first) {
                toast.error({ detail: 'Validation failed. Please check your input and try again.' })
                return
            }

            const errorMessage = rest.length > 0 ? `${first.message} (and ${rest.length} more errors)` : first.message

            toast.error({ detail: errorMessage })
        } else {
            toast.error({ detail: 'Something went wrong try again.' })
        }
    }
}

watch(
    provider,
    (newData) => {
        if (!newData) return

        const cacheTtlInHours = newData.cacheTtlInMs ? newData.cacheTtlInMs / (1000 * 60 * 60) : 4

        formData.value = {
            title: newData.title,
            cacheTtlInHours,
            autoSyncEnabled: Boolean(newData.autoSyncEnabled),
        }
    },
    { immediate: true }
)
</script>

<template>
    <div class="app-card flex h-full w-full overflow-hidden">
        <div v-if="provider" class="container mx-auto flex h-full flex-col overflow-hidden p-2 xl:max-w-4xl">
            <div class="flex items-center justify-between border-b">
                <h1 class="text-3xl"><span class="font-bold">{{ provider.title }}</span> Settings</h1>
            </div>

            <div class="mt-2 flex h-full w-full flex-col gap-4 overflow-auto">
                <div class="flex flex-col">
                    <label class="font-bold" for="provider_title">Title</label>
                    <InputText
                        id="provider_title"
                        size="small"
                        placeholder="Enter provider title"
                        v-model.trim="formData.title"
                    />
                </div>

                <div class="flex flex-col">
                    <label class="font-bold" for="cacheTtlInMs">Cache TTL (hours)</label>

                    <InputNumber
                        id="cacheTtlInMs"
                        size="small"
                        placeholder="Enter cache TTL (hours)"
                        :min="1"
                        v-model.number="formData.cacheTtlInHours"
                    />
                </div>

                <div class="flex items-center gap-2">
                    <Checkbox binary v-model="formData.autoSyncEnabled" id="autoSyncEnabled" />
                    <label class="font-bold" for="provider_title">Auto Sync Enabled</label>
                </div>

                <div class="flex w-full items-center justify-end border-t">
                    <Button text label="Save" @click="saveProviderSettings" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
