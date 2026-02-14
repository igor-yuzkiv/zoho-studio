# ArtifactExplorerMenu

`ArtifactExplorerMenu` показує список artifacts, підтримує групування, пошук і вибір активного елемента.
Компонент використовується в workspace-меню capability (functions, workflows, modules).

## API

### Props

- `items: IArtifact[]` — список artifacts для відображення.
- `groupBy?: ArtifactGroupBy` — групування за полем або функцією. Якщо не задано, список плоский.
- `activeId?: ArtifactId` — ID активного artifact.
- `icon?: string` — іконка для елементів (fallback у `ArtifactExplorerMenuItem`).
- `searchPlaceholder?: string` — плейсхолдер інпуту пошуку.
- `searchFields?: string[]` — поля, за якими виконується пошук (за замовчуванням `['display_name', 'api_name']`).

### Emits

- `update:activeId(artifactId?: ArtifactId)` — оновлює поточний активний ID.
- `select(artifact: IArtifact)` — викликається при виборі artifact.

### Slots

- `item-icon` — кастомний слот іконки для елементів списку.

## Поведінка

- Пошук case-insensitive, з `trim`. Працює як для групованих, так і для плоских списків.
- Якщо `groupBy` заданий, фільтрація виконується всередині груп.
- Порожні результати показують state `No items found.`.
- Підтримуються клавіші `ArrowUp`/`ArrowDown` для навігації між видимими items.

## Типи

- `ArtifactGroupBy` — `string | (artifact) => string`
- `ArtifactGroup` — структура групи для рендера

Файл: `apps/chrome-ext/src/components/artifacts-explorer/types.ts`.

## Приклад

```vue
<script setup lang="ts">
import { ArtifactExplorerMenu } from '@/components/artifacts-explorer'
import { useCapabilityArtifactsListQuery } from '@/queries'
import { useCurrentProvider } from '@/composables'

const { providerId } = useCurrentProvider()
const { data } = useCapabilityArtifactsListQuery(providerId, 'functions')
</script>

<template>
  <ArtifactExplorerMenu
    :items="data"
    :group-by="(artifact) => artifact.payload.type"
    @select="(artifact) => console.log(artifact.id)"
  />
</template>
```
