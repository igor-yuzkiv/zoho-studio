import { BrowserServiceToken } from '@zoho-studio/core'
import { container } from 'tsyringe'

export async function registerDependencies() {
    if (import.meta.env.VITE_API_MODE === 'mock') {
        const { MockBrowserServiceImpl } = await import('@zoho-studio/dev-mock-api')
        container.register(BrowserServiceToken, { useClass: MockBrowserServiceImpl })
    } else {
        const { ChromeBrowserServiceImpl } = await import('../browser/chrome-browser.service.ts')

        container.register(BrowserServiceToken, { useClass: ChromeBrowserServiceImpl })
    }
}
