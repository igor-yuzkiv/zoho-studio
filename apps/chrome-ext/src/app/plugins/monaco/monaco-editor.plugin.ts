import './monaco-editor-worker.ts'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'
import type { App } from 'vue'

export function monacoEditorPlugin(app: App) {
    app.use(VueMonacoEditorPlugin)
}
