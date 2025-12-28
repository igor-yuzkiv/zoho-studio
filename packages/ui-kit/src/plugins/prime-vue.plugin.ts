import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import Ripple from 'primevue/ripple'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

const MyPreset = definePreset(Aura, {
    semantic: {
        colorScheme: {
            primary: {
                50: '{orange.50}',
                100: '{orange.100}',
                200: '{orange.200}',
                300: '{orange.300}',
                400: '{orange.400}',
                500: '{orange.500}',
                600: '{orange.600}',
                700: '{orange.700}',
                800: '{orange.800}',
                900: '{orange.900}',
                950: '{orange.950}',
            },
        },
    },
})

export default function (app: App) {
    app.use(PrimeVue, {
        theme: {
            preset: MyPreset,
            options: {
                darkModeSelector: '.dark',
                cssLayer: {
                    name: 'primevue',
                    order: 'theme, base, primevue',
                },
            },
        },
        ripple: true,
    })

    app.directive('ripple', Ripple)
    app.directive('tooltip', Tooltip)

    app.use(ToastService)
    app.use(ConfirmationService)
}
