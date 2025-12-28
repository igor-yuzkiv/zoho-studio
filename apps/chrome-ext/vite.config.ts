/// <reference types='vitest' />
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

export default defineConfig(() => ({
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/chrome-ext',
    base: '',
    server: {
        port: 4201,
        host: 'localhost',
        /*proxy: {
            '/api': {
                target: env.VITE_API_PROXY_URL,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },*/
    },
    preview: {
        port: 4300,
        host: 'localhost',
    },
    plugins: [vue({}), tailwindcss(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [],
    // },
    build: {
        outDir: './build/dist',
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
}))
