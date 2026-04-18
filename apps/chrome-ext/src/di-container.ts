import { container } from 'tsyringe'

import { ArtifactStorageToken, BrowserServiceToken, ProvidersStorageToken } from '@zoho-studio/core'
import { DexieArtifactsStorage, LocalStorageProvidersStorage } from '@zoho-studio/local-data-storage'
import { RemoteArtifactsStorage, RemoteProvidersStorage } from '@zoho-studio/remote-data-storage'
import { ChromeBrowserServiceImpl } from './lib/browser'

const isRemoteStorage = import.meta.env.VITE_STORAGE_STRATEGY === 'remote'

container.register(BrowserServiceToken, {
    useClass: ChromeBrowserServiceImpl,
})

container.register(ArtifactStorageToken, {
    useClass: isRemoteStorage ? RemoteArtifactsStorage : DexieArtifactsStorage,
})

container.register(ProvidersStorageToken, {
    useClass: isRemoteStorage ? RemoteProvidersStorage : LocalStorageProvidersStorage,
})
