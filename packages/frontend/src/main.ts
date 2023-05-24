import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { useVersionStore } from '@stores/version-store'

async function start() {
  const pinia = createPinia()
  const app = createApp(App)
  app.use(pinia)
  await useVersionStore().load()
  app.mount('#app')
}
start()
