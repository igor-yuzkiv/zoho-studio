import { VueQueryPlugin } from '@tanstack/vue-query'
import type { App } from 'vue'

export function vueQueryPlugin(app: App) {
    //TODO: configure retry, cache time, stale time, etc.
    app.use(VueQueryPlugin)
}
