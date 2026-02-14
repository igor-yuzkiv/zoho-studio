import { container } from 'tsyringe'

import { BrowserServiceToken, ArtifactStorageToken } from '@zoho-studio/core'
import { ChromeBrowserServiceImpl } from './shared/browser'
import { DexieArtifactsStorage } from './shared/artifacts-storage'

container.register(BrowserServiceToken, {
    useClass: ChromeBrowserServiceImpl,
})

container.register(ArtifactStorageToken, {
    useClass: DexieArtifactsStorage,
})
