import { container } from 'tsyringe'

import { BrowserServiceToken } from '@zoho-studio/core'
import { ChromeBrowserServiceImpl } from '../browser'
import { isMockApiEnabled, MockBrowserServiceImpl } from '@zoho-studio/dev-mock-api'

container.register(BrowserServiceToken, {
    useClass: isMockApiEnabled ? MockBrowserServiceImpl : ChromeBrowserServiceImpl,
})
