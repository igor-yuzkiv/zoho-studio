import { container } from 'tsyringe'

import { BrowserServiceToken, ArtifactStorageToken } from '@zoho-studio/core'
import { DexieArtifactsStorage } from '@zoho-studio/dexie-artifacts-storage'
import { ChromeBrowserServiceImpl } from './lib/browser'

container.register(BrowserServiceToken, {
    useClass: ChromeBrowserServiceImpl,
})

container.register(ArtifactStorageToken, {
    useClass: DexieArtifactsStorage,
})
