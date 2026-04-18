import { container } from 'tsyringe'

import { ArtifactStorageToken, BrowserServiceToken, ProvidersStorageToken } from '@zoho-studio/core'
import { DexieArtifactsStorage } from '@zoho-studio/local-data-storage'
import { RemoteProvidersStorage } from '@zoho-studio/remote-data-storage'
import { ChromeBrowserServiceImpl } from './lib/browser'

container.register(BrowserServiceToken, {
    useClass: ChromeBrowserServiceImpl,
})

container.register(ArtifactStorageToken, {
    useClass: DexieArtifactsStorage,
})

container.register(ProvidersStorageToken, {
    useClass: RemoteProvidersStorage,
})
