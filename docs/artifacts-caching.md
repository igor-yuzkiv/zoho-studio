# Кешування артефактів

## Огляд

Кешування артефактів — механізм локального збереження отриманих артефактів провайдера в IndexedDB браузера,
щоб розширення не робило повторних запитів до Zoho API при кожному завантаженні сторінки.

Кожен провайдер (наприклад, інстанс Zoho CRM) має власний незалежний життєвий цикл кешу.

## Шари зберігання

Система використовує два шари зберігання:

| Шар | Технологія | Що зберігає |
|---|---|---|
| **Artifacts Storage** | IndexedDB (через Dexie) | Записи артефактів (functions, workflows, modules, fields) |
| **Sync Metadata** | localStorage (через Pinia + `useStorage`) | Мітка часу `lastSyncedAt` для кожного провайдера |

### Навіщо два шари?

- IndexedDB ефективно працює з великими обсягами структурованих даних (тисячі артефактів)
- `lastSyncedAt` — легковісне значення метаданих, яке повинно зберігатися між перезавантаженнями сторінки та використовується для швидкої перевірки TTL без запитів до IndexedDB

## Життєвий цикл кешу

### Автоматична синхронізація при відкритті workspace

Коли користувач переходить до workspace (монтується `WorkspaceLayout`), система автоматично оцінює, чи потрібна синхронізація:

```
WorkspaceLayout.onMounted()
  -> useProviderCacheManager().ensureSyncArtifacts(provider)
       -> isSyncRequired(provider)
            -> countByProviderId()  -- чи є закешовані артефакти?
            -> isCacheStale()      -- чи минув TTL?
       -> якщо потрібно: sync -> invalidate queries -> update lastSyncedAt
       -> якщо ні: пропустити
```

### Коли запускається синхронізація

Синхронізація потрібна, коли виконується **хоча б одна** умова:
- В IndexedDB немає закешованих артефактів для цього провайдера (`count <= 0`)
- TTL кешу минув (`Date.now() - lastSyncedAt > PROVIDER_CACHE_TTL_MS`)

TTL налаштовується у `config/provider-cache.config.ts` (за замовчуванням: **2 години**).

### Ручне оновлення

Користувач може вручну запустити оновлення кешу через кнопку у футері workspace.
Це виконує повний цикл: **видалення -> синхронізація -> інвалідація -> оновлення мітки часу**.

Кнопка деактивується, поки будь-яка операція з кешем виконується для поточного провайдера,
та блокується повністю, коли провайдер офлайн (немає активної вкладки браузера).

## Потік даних

### Синхронізація (fetch + persist)

```
useArtifactsFetcher
  -> для кожного capability (functions, workflows, modules):
       -> створити інстанс адаптера
       -> рекурсивно завантажити всі сторінки з Zoho API
       -> зібрати всі артефакти
  -> повернути плаский масив усіх артефактів

useArtifactsSync
  -> викликати fetcher.fetchProviderArtifacts()
  -> викликати artifactsStorage.bulkUpsert() -- зберегти в IndexedDB
```

### Інвалідація

Після будь-якої мутації кешу (sync, clear, refresh) кеш vue-query інвалідується
за ієрархічним ключем `['artifacts', 'provider', providerId]`.
Це каскадно інвалідує всі capability-специфічні запити під цим провайдером.

## Операції з кешем

### `ensureSyncArtifacts(provider)`

Лінива синхронізація — завантажує лише якщо кеш відсутній або застарілий.

1. Перевірити, чи операція вже виконується (пропустити, якщо так)
2. Перевірити `isSyncRequired` (пропустити, якщо кеш свіжий)
3. Завантажити всі артефакти з API
4. Зберегти в IndexedDB через `bulkUpsert`
5. Інвалідувати кеш vue-query
6. Оновити `lastSyncedAt` у store провайдера

### `clearProviderCache(providerId)`

Видаляє закешовані дані без повторної синхронізації.

1. Перевірити, чи операція вже виконується (пропустити, якщо так)
2. Видалити всі артефакти з IndexedDB для цього провайдера
3. Інвалідувати кеш vue-query

### `refreshProviderCache(provider)`

Повне скидання кешу: очищення + синхронізація.

1. Перевірити, чи операція вже виконується (пропустити, якщо так)
2. Видалити всі артефакти з IndexedDB
3. Завантажити всі артефакти з API
4. Зберегти в IndexedDB
5. Інвалідувати кеш vue-query
6. Оновити `lastSyncedAt`

## Захист від конкурентного доступу

Операції захищені per-provider за допомогою `Set<ServiceProviderId>`.
Якщо операція з кешем вже виконується для даного провайдера, наступні виклики пропускаються з попередженням у консолі.
Це запобігає дублюванню запитів, коли кілька компонентів одночасно ініціюють синхронізацію.

## Ключові файли

| Файл | Роль |
|---|---|
| `composables/use.provider-cache-manager.ts` | Оркестрація кешу (ensure, clear, refresh) |
| `composables/use.artifacts.sync.ts` | Логіка fetch + persist |
| `composables/use.artifacts.fetcher.ts` | Посторінкове завантаження через capability-адаптери |
| `composables/use.artifacts.storage.ts` | DI-резолвер для `IArtifactsStorage` |
| `composables/use.capabilities.manager.ts` | Пошук capability-дескрипторів |
| `shared/artifacts-storage/dexie.artifacts-storage.ts` | IndexedDB-реалізація `IArtifactsStorage` |
| `config/provider-cache.config.ts` | Конфігурація TTL |
| `config/query-keys.config.ts` | Ієрархія ключів vue-query |
| `store/use.providers-runtime.store.ts` | Стан провайдера + збереження `lastSyncedAt` |
| `layouts/ui/WorkspaceLayout.vue` | Точка входу: auto-sync при монтуванні, UI оновлення |
