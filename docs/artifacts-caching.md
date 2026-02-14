# Artifacts Caching

## Overview

Artifacts caching is the mechanism that stores fetched provider artifacts locally in the browser's IndexedDB,
so the extension doesn't need to re-fetch them from Zoho APIs on every page load.

Each provider (e.g. Zoho CRM instance) has its own independent cache lifecycle.

## Storage Layers

The system uses two storage layers:

| Layer | Technology | What it stores |
|---|---|---|
| **Artifacts Storage** | IndexedDB (via Dexie) | Artifact records (functions, workflows, modules, fields) |
| **Sync Metadata** | localStorage (via Pinia + `useStorage`) | `lastSyncedAt` timestamp per provider |

### Why two layers?

- IndexedDB handles large volumes of structured data efficiently (thousands of artifacts)
- `lastSyncedAt` is a lightweight metadata value that needs to survive page reloads and is used for quick TTL checks without querying IndexedDB

## Cache Lifecycle

### Automatic sync on workspace open

When a user navigates to a workspace (`WorkspaceLayout` mounts), the system automatically evaluates whether sync is needed:

```
WorkspaceLayout.onMounted()
  -> useProviderCacheManager().ensureSyncArtifacts(provider)
       -> isSyncRequired(provider)
            -> countByProviderId()  -- are there any cached artifacts?
            -> isCacheStale()      -- has TTL expired?
       -> if required: sync -> invalidate queries -> update lastSyncedAt
       -> if not required: skip
```

### When sync is triggered

Sync is required when **either** condition is true:
- No cached artifacts exist in IndexedDB for this provider (`count <= 0`)
- Cache TTL has expired (`Date.now() - lastSyncedAt > PROVIDER_CACHE_TTL_MS`)

TTL is configured in `config/provider-cache.config.ts` (default: **2 hours**).

### Manual refresh

The user can manually trigger a cache refresh via the button in the workspace footer.
This performs a full cycle: **delete -> sync -> invalidate -> update timestamp**.

The button is disabled while any cache operation is in progress for the current provider,
and is blocked entirely when the provider is offline (no active browser tab).

## Data Flow

### Sync (fetch + persist)

```
useArtifactsFetcher
  -> for each capability (functions, workflows, modules):
       -> create adapter instance
       -> recursively fetch all pages from Zoho API
       -> collect all artifacts
  -> return flat array of all artifacts

useArtifactsSync
  -> call fetcher.fetchProviderArtifacts()
  -> call artifactsStorage.bulkUpsert() -- persist to IndexedDB
```

### Query (read from cache)

```
useCapabilityArtifactsListQuery(providerId, capabilityType)
  -> vue-query with key: ['artifacts', 'provider', providerId, 'capability', capabilityType]
  -> queryFn: artifactsStorage.findByProviderIdAndCapabilityType()
  -> reads from IndexedDB
```

### Invalidation

After any cache mutation (sync, clear, refresh), vue-query cache is invalidated
using the hierarchical key `['artifacts', 'provider', providerId]`.
This cascades to all capability-specific queries under that provider.

## Cache Operations

### `ensureSyncArtifacts(provider)`

Lazy sync -- only fetches if cache is missing or stale.

1. Check if operation already in progress (skip if yes)
2. Check `isSyncRequired` (skip if cache is fresh)
3. Fetch all artifacts from API
4. Persist to IndexedDB via `bulkUpsert`
5. Invalidate vue-query cache
6. Update `lastSyncedAt` in provider store

### `clearProviderCache(providerId)`

Removes cached data without re-syncing.

1. Check if operation already in progress (skip if yes)
2. Delete all artifacts from IndexedDB for this provider
3. Invalidate vue-query cache

### `refreshProviderCache(provider)`

Full cache reset: clear + sync.

1. Check if operation already in progress (skip if yes)
2. Delete all artifacts from IndexedDB
3. Fetch all artifacts from API
4. Persist to IndexedDB
5. Invalidate vue-query cache
6. Update `lastSyncedAt`

## Concurrency Protection

Operations are guarded per-provider using a `Set<ServiceProviderId>`.
If a cache operation is already in progress for a given provider, subsequent calls are skipped with a console warning.
This prevents duplicate fetches when multiple components trigger sync simultaneously.

## Key Files

| File | Role |
|---|---|
| `composables/use.provider-cache-manager.ts` | Cache orchestration (ensure, clear, refresh) |
| `composables/use.artifacts.sync.ts` | Fetch + persist logic |
| `composables/use.artifacts.fetcher.ts` | Paginated API fetching via capability adapters |
| `composables/use.artifacts.storage.ts` | DI resolver for `IArtifactsStorage` |
| `composables/use.capabilities.manager.ts` | Capability descriptors lookup |
| `shared/artifacts-storage/dexie.artifacts-storage.ts` | IndexedDB implementation of `IArtifactsStorage` |
| `config/provider-cache.config.ts` | TTL configuration |
| `config/query-keys.config.ts` | Vue-query key hierarchy |
| `queries/use.capability-artifacts-list.query.ts` | Vue-query composable for reading cached artifacts |
| `store/use.providers-runtime.store.ts` | Provider state + `lastSyncedAt` persistence |
| `layouts/ui/WorkspaceLayout.vue` | Entry point: auto-sync on mount, refresh UI |

## Query Key Hierarchy

```
['artifacts']                                          -- all artifacts
  ['artifacts', 'provider', providerId]                -- all for a provider
    ['artifacts', 'provider', providerId, 'capability', type]  -- specific capability
  ['artifacts', 'by-id', id]                           -- single artifact
```

Invalidating `byProviderId` cascades to all `byProviderIdAndType` queries under that provider.
