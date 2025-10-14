import { createApp, h, provide } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice'; 
import Tooltip from 'primevue/tooltip' //

import { apolloClient } from './apollo'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createPinia } from 'pinia'

const app = createApp({
  setup() {
    // Cung cấp Apollo Client toàn cục
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})
const pinia = createPinia()
app.use(pinia)
app.use(ToastService); 
app.use(router)
app.use(PrimeVue)
app.directive('tooltip', Tooltip)
app.mount('#app')
