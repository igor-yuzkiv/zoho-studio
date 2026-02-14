# Core Concepts Documentation

## 1. Overview

`packages/core` визначає контрактну модель системи для інтеграцій із зовнішніми сервісами (Zoho CRM, інші Zoho-продукти тощо), не прив'язуючись до конкретної реалізації API або UI.

Ядро вирішує такі задачі:

- уніфікує модель провайдера сервісу (`ServiceProvider`);
- уніфікує модель можливостей провайдера (`CapabilityDescriptor`);
- задає порт доступу до даних capability (`ICapabilityAdapter`);
- задає канонічний формат доменних сутностей (`IArtifact`);
- задає абстракцію збереження (`IArtifactsStorage`);
- задає механізм реєстрації інтеграцій (`IIntegrationManifest`, `IIntegrationsRegistry`).

Ключова ідея: `core` містить лише типи, інтерфейси та базові абстракції. Конкретні інтеграції та інфраструктурні деталі (Chrome API, Dexie, Zoho endpoints) винесені в `integrations/*` та `apps/*`.

## 2. Service Provider

### Що це

`ServiceProvider` (`packages/core/src/provider/service-provider.ts`) - це інстанс зовнішнього сервісу в контексті рантайму:

- `id`, `type`, `title`;
- `metadata` (провайдер-специфічні дані);
- `browserTabId` (прив'язка до вкладки браузера);
- `lastSyncedAt`.

### Відповідальність

- представляє конкретне підключення до сервісу;
- є контекстом для всіх adapter-операцій;
- є ключем сегментації artifact-даних.

### Які capability експортує

Сам `ServiceProvider` не містить capability всередині себе. Capability визначаються маніфестом інтеграції:

- `IIntegrationManifest.capabilities` у `packages/core/src/integration/integration.manifest.ts`.

### Реєстрація і резолв

1. Інтеграція реєструє маніфест у registry:
   `apps/chrome-ext/src/integrations.registry.ts`.
2. Runtime сканує вкладки браузера і викликає `manifest.resolveFromBrowserTab(...)`:
   `apps/chrome-ext/src/store/use.providers-runtime.store.ts`.
3. Якщо резолв успішний, `ServiceProvider` потрапляє у `providersMap`.

### Приклад реалізації

`integrations/zoho-crm/src/manifest.ts`:

- `serviceProviderType: 'zoho-crm'`;
- `capabilities: [CrmFunctionsDescriptor, CrmWorkflowsDescriptor, CrmModulesDescriptor, CrmFieldsDescriptor]`;
- `resolveFromBrowserTab(...)` парсить URL і формує `ServiceProvider`.

## 3. Capability

### Що це

Capability - це опис функціонального домену, який провайдер підтримує.

Контракт: `CapabilityDescriptor` (`packages/core/src/capability/capability.descriptor.ts`):

- `type: CapabilityType`;
- `title`, `icon`, `hideInMenu?`;
- `dependsOn?: CapabilityType` — залежність від іншого capability (синхронізація виконується після нього);
- `adapter: CapabilityAdapterConstructor`.

`CapabilityType` у core: `'functions' | 'workflows' | 'modules' | 'fields'`.
У поточному UI-маршрутингу активно використані `functions`, `workflows`, `modules`.
`fields` має `hideInMenu: true` та `dependsOn: 'modules'` — не відображається у меню та синхронізується після modules.

### Зв'язок з provider

Для конкретного `ServiceProvider` список capability береться з його маніфесту через:

- `useCapabilitiesManager().getProviderCapabilities(provider)`
  (`apps/chrome-ext/src/composables/use.capabilities.manager.ts`).

### Приклади

- Реалізація descriptor:
  `integrations/zoho-crm/src/capabilities/functions/descriptor.ts`,
  `integrations/zoho-crm/src/capabilities/workflows/descriptor.ts`,
  `integrations/zoho-crm/src/capabilities/modules/descriptor.ts`,
  `integrations/zoho-crm/src/capabilities/fields/descriptor.ts`.
- Використання у UI (без бізнес-логіки): формування меню і маршруту
  `/workspace/:providerId/capabilities/:type` у
  `apps/chrome-ext/src/components/provider-capabilities-menu/ui/ProviderCapabilitiesMenu.vue`.

## 4. Adapter

### Що це

Adapter - це реалізація порту `ICapabilityAdapter`
(`packages/core/src/capability/capability.adapter.ts`):

- має `serviceProvider`;
- реалізує `list(pagination) -> PromisePaginatedResult<IArtifact>`.

### Чому це окремий шар

Adapter ізолює домен `core` від зовнішнього API:

- всередині працює з HTTP, cookies, форматом відповіді;
- назовні повертає лише уніфіковані `IArtifact`.

### Різниця між capability та adapter

- Capability (`CapabilityDescriptor`) відповідає на питання "що доступно".
- Adapter відповідає на питання "як отримати artifact-дані для цього capability".

Межа відповідальності capability закінчується на виборі adapter-класу.
Далі вся інтеграційна логіка - в adapter/api/mapper.

### Приклади

- `CrmFunctionsAdapter`:
  `integrations/zoho-crm/src/capabilities/functions/adapter.ts`.
- `CrmWorkflowsAdapter`:
  `integrations/zoho-crm/src/capabilities/workflows/adapter.ts`.
- `CrmModulesAdapter`:
  `integrations/zoho-crm/src/capabilities/modules/adapter.ts`.
- `CrmFieldsAdapter`:
  `integrations/zoho-crm/src/capabilities/fields/adapter.ts` —
  читає modules зі storage через DI (`container.resolve<IArtifactsStorage>`),
  фільтрує `api_supported`, потім завантажує поля для кожного модуля.
- Зовнішній API шар:
  `integrations/zoho-crm/src/base-crm-api.service.ts`,
  `integrations/zoho-crm/src/capabilities/functions/api.ts`.

## 5. Artifact

### Що це

`IArtifact` (`packages/core/src/artifact/artifact.ts`) - канонічна сутність, яка представляє одиницю даних capability у системі.

Ключові поля:

- ідентифікація: `id`, `source_id`, `provider_id`, `capability_type`, `parent_id?`;
- відображення: `display_name`, `api_name?`;
- зміст: `payload` (тип залежить від capability);
- сире джерело: `origin`.

### Payload

`ArtifactPayloadMap` мапить `capability_type` на тип payload:

- `functions -> FunctionArtifactPayload` — `{ type, script?, params? }`;
- `workflows -> WorkflowArtifactPayload` — `{ module_api_name, module_display_name }`;
- `modules -> ModuleArtifactPayload` — `{ api_supported }`;
- `fields -> FieldArtifactPayload` — `{ data_type, display_data_type }`.

### Формування ID

`makeArtifactId(providerId, capabilityType, partials)` у
`packages/core/src/artifact/artifact.utils.ts`:

- результат: `providerId:capabilityType:...partials`.

Приклади:

- Functions: `makeArtifactId(providerId, 'functions', data.id)` → `zoho-crm:us:functions:123`;
- Modules: `makeArtifactId(providerId, 'modules', data.api_name)` → `zoho-crm:us:modules:Contacts`;
- Fields: `makeArtifactId(providerId, 'fields', [module.api_name, field.api_name])` → `zoho-crm:us:fields:Contacts:Email`.

Fields використовують `parent_id` для зв'язку з модулем:
`parent_id: makeArtifactId(providerId, 'modules', module.api_name)`.

### Використання в routing

`artifact.id` використовується як параметр маршруту `:artifactId?`:

- `/workspace/:providerId/capabilities/functions/:artifactId?`;
- `/workspace/:providerId/capabilities/workflows/:artifactId?`;
- `/workspace/:providerId/capabilities/modules/:artifactId?`.

Див. `apps/chrome-ext/src/app/router/router.ts`,
`apps/chrome-ext/src/pages/workspace/*/*MenuPage.vue`.

## 6. Storage

### Що це

Storage у core - абстракція персистенсу artifact-даних через `IArtifactsStorage`
(`packages/core/src/storage/artifacts-storage.ts`).

Контракт:

- `bulkUpsert(artifacts: IArtifact[]): Promise<boolean>`;
- `findByProviderIdAndCapabilityType(providerId, capabilityType)`;
- `countByProviderId(providerId): Promise<number>`;
- `deleteByProviderId(providerId): Promise<number>`.

### Для чого

- кешувати/зберігати завантажені artifacts;
- читати artifacts для конкретного provider+capability;
- відокремити core/use-cases від конкретної БД.

### Чому абстрактний

`core` не залежить від конкретної технології зберігання.
У `apps/chrome-ext` реалізація - `DexieArtifactsStorage`:

- `apps/chrome-ext/src/shared/artifacts-storage/dexie.artifacts-storage.ts`;
- реєстрація через DI token `ArtifactStorageToken` у
  `apps/chrome-ext/src/di-container.ts`.

В інтеграціях storage напряму не реалізується: інтеграція постачає artifacts через adapter, а застосунок вирішує, як їх зберігати.

## 7. Взаємодія між сутностями

Повний ланцюжок:

`ServiceProvider -> Capability -> Adapter -> Artifact -> Storage`

### Отримання списку artifacts

1. Runtime резолвить `ServiceProvider` із вкладок браузера через `IIntegrationManifest.resolveFromBrowserTab`.
2. Для provider береться список `CapabilityDescriptor` із manifest.
3. Capabilities розділяються на фази за `dependsOn`:
   - Фаза 1: capabilities без залежностей (functions, workflows, modules) — завантажуються паралельно.
   - Проміжний `bulkUpsert` — збереження результатів у storage.
   - Фаза 2: capabilities із залежностями (fields з `dependsOn: 'modules'`) — завантажуються після збереження залежностей.
4. Для кожного capability створюється `new capability.adapter(provider)`.
5. Adapter викликає зовнішній API, мапить дані в `IArtifact[]`.
6. `useArtifactsSync` зберігає результат через `IArtifactsStorage.bulkUpsert`.

Код: `apps/chrome-ext/src/composables/use.artifacts.fetcher.ts`,
`apps/chrome-ext/src/composables/use.artifacts.sync.ts`.

### Виконання операції над artifact

У поточній реалізації core формалізує операцію `list(...)`.
Потік операції в UI:

1. Читання artifacts із storage через `useCapabilityArtifactsListQuery`.
2. Вибір artifact у меню.
3. Навігація з `artifact.id` у route params.

Код: `apps/chrome-ext/src/queries/use.capability-artifacts-list.query.ts`,
`apps/chrome-ext/src/pages/workspace/functions/FunctionsMenuPage.vue`.

### Межа core та integrations

- `core`: контракти, типи, порти, реєстр інтеграцій, доменна модель.
- `integrations/*`: реалізація manifest, adapter, api-клієнтів, mapper-ів під конкретний сервіс.
- `apps/*`: інфраструктура рантайму (browser service, DI, storage, routing, UI-композиція).
