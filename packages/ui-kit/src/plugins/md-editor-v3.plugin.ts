import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { config as mdEditorConfig } from 'md-editor-v3'
import mermaid from 'mermaid'

mdEditorConfig({
    editorExtensions: {
        highlight: { instance: hljs },
        mermaid: { instance: mermaid },
        katex: { instance: katex },
    },
    katexConfig(base: any) {
        return {
            ...base,
            strict: false, // Disable strict mode to allow all cyrylic characters
        }
    },
})
