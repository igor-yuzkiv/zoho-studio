import 'reflect-metadata'
import './di-container.ts'

import AppComponent from './app/App.vue'
import { registerAppPlugins } from './app/plugins'
import { router } from './app/router'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { registerUiKitPlugins } from '@zoho-studio/ui-kit'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

const app = createApp(AppComponent)
const pinia = createPinia()

app.use(pinia)
app.use(router)

registerUiKitPlugins(app)
registerAppPlugins(app)

app.mount('#root')
