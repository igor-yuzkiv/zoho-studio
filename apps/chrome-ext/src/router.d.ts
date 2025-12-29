// router.d.ts
import type { AppLayoutName } from './app/layouts'
import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        layout?: AppLayoutName
        authenticated?: boolean
        hideSidebarMenu?: boolean
        hideTopbar?: boolean
        hideFooter?: boolean
    }
}
