import { container } from 'tsyringe'

import { BrowserServiceToken, ArtifactStorageToken } from '@zoho-studio/core'
import { ChromeBrowserServiceImpl } from './lib/browser'
import { DexieArtifactsStorage } from './lib/artifacts-storage'

container.register(BrowserServiceToken, {
    useClass: ChromeBrowserServiceImpl,
})

container.register(ArtifactStorageToken, {
    useClass: DexieArtifactsStorage,
})
