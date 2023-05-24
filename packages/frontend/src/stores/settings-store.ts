import { StarterDto } from '@nest-vue-starter/shared'
import { defineStore } from 'pinia'

const baseUrl = 'http://localhost:3000'

interface SettingsState {
  version: StarterDto
}

export const useSettingsStore = defineStore('version', {
  state: (): SettingsState => ({
    version: {} as StarterDto,
  }),
  actions: {
    async load() {
      const response = await fetch(`${baseUrl}/api/version`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      this.version = await response.json()
      console.log(this.version)
    },
  },
})
