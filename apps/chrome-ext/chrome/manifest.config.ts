import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
    manifest_version: 3,
    name: 'ZohoStudioIDE V3',
    description: 'ZohoStudioIDE V3',
    version: '0.1.0',
    permissions: ['scripting', 'activeTab', 'sidePanel', 'cookies', 'webRequest'],
    icons: {
        '16': 'logo.png',
        '48': 'logo.png',
        '128': 'logo.png',
    },
    action: {
        default_title: 'ZohoStudioIDE V3',
    },
    side_panel: {
        default_path: 'index.html',
    },
    background: {
        service_worker: 'chrome/service-worker.ts',
    },
    host_permissions: [
        '*://*.zoho.eu/*',
        '*://*.zoho.com/*',
        '*://*.zoho.in/*',
        '*://*.zoho.jp/*',
        '*://*.zoho.com.au/*',
        '*://*.zoho.com.cn/*',
        '*://localhost/*',
        '*://127.0.0.1/*',
    ],
    content_scripts: [
        {
            matches: [
                '*://*.zoho.eu/*',
                '*://*.zoho.com/*',
                '*://*.zoho.in/*',
                '*://*.zoho.jp/*',
                '*://*.zoho.com.au/*',
                '*://*.zoho.com.cn/*',
            ],
            js: ['chrome/content-script.ts'],
        },
    ],
})
