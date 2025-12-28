import type { App } from 'vue'
// import { monacoEditorPlugin } from './monaco/monaco-editor.plugin.ts'
import { vueQueryPlugin } from './vue-query/vue-query.plugin.ts'

export function registerAppPlugins(app: App) {
    // monacoEditorPlugin(app)
    vueQueryPlugin(app)
}
