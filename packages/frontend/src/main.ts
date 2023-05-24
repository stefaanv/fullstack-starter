import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { useSettingsStore } from '@stores/settings-store'
import axios from 'axios'

const API_TIMEOUT = 3000

function joinUrl(...parts: string[]) {
  return parts.reduce((accu, curr) => (accu ? accu.replace(/\/$/, '') + '/' + curr : curr), '')
}

async function start() {
  // const baseUrl = 'http://localhost:3000'
  const baseURL =
    import.meta.env.MODE === 'production'
      ? joinUrl(window.location.origin, import.meta.env.VITE_BACKEND_URL)
      : import.meta.env.VITE_BACKEND_URL

  axios.defaults.baseURL = baseURL
  axios.defaults.timeout = API_TIMEOUT

  const pinia = createPinia()
  const app = createApp(App)
  app.use(pinia)
  const settings = await useSettingsStore().load()
  document.title = settings.config.windowTitle
  app.mount('#app')
}
start()
