import { defineManifest } from '@crxjs/vite-plugin'

type CreateManifestParams = {
    appName: string
    appVersion: string
    extraHostPermissions: string[]
}

export function createManifest(params: CreateManifestParams) {
    return defineManifest({
        manifest_version: 3,
        name: params.appName,
        description: params.appName,
        version: params.appVersion,
        permissions: ['scripting', 'activeTab', 'sidePanel', 'cookies', 'webRequest'],
        icons: {
            '16': 'logo.png',
            '48': 'logo.png',
            '128': 'logo.png',
        },
        action: {
            default_title: params.appName,
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
            ...params.extraHostPermissions.filter((url) => !!url),
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
}
