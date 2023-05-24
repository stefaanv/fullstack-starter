import { StarterDto } from '@nest-vue-starter/shared'
import { defineStore } from 'pinia'

function joinUrl(...parts: string[]) {
  return parts.reduce((accu, curr) => (accu ? accu.replace(/\/$/, '') + '/' + curr : curr), '')
}
// const baseUrl = 'http://localhost:3000'
const baseUrl =
  import.meta.env.MODE === 'production'
    ? joinUrl(window.location.origin, import.meta.env.VITE_BACKEND_URL)
    : import.meta.env.VITE_BACKEND_URL
interface SettingsState {
  version: StarterDto
  baseUrl: string
}

export const useSettingsStore = defineStore('version', {
  state: (): SettingsState => ({
    version: {} as StarterDto,
    baseUrl,
  }),
  actions: {
    async load() {
      const url = joinUrl(this.baseUrl, 'version')
      console.log(import.meta.env.MODE)
      console.log(url)
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      this.version = await response.json()
    },
  },
})
