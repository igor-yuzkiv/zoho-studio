import { container } from 'tsyringe'

import { BrowserServiceToken } from '@zoho-studio/core'
import { ChromeBrowserServiceImpl } from './browser'

container.register(BrowserServiceToken, {
    useClass: ChromeBrowserServiceImpl,
})
