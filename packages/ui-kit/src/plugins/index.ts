import primeVuePlugin from './prime-vue.plugin.ts'
import type { App } from 'vue'

export * from './prime-vue.plugin.ts'

export function registerUiKitPlugins(app: App) {
    primeVuePlugin(app)
}
