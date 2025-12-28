// router.d.ts
import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        authenticated?: boolean
        hideSidebarMenu?: boolean
        hideTopbar?: boolean
        hideFooter?: boolean
    }
}
