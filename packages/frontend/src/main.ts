import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { useSettingsStore } from '@stores/settings-store'

async function start() {
  const pinia = createPinia()
  const app = createApp(App)
  app.use(pinia)
  await useSettingsStore().load()
  app.mount('#app')
}
start()
