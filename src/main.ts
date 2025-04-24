import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router' 
import '@mdi/font/css/materialdesignicons.css'

// Vuetify 関連
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')