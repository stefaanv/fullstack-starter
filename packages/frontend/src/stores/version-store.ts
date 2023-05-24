import { StarterDto } from '@nest-vue-starter/shared'
import { defineStore } from 'pinia'

const baseUrl = 'http://localhost:3000'

interface VersionState {
  version: StarterDto
}

export const useVersionStore = defineStore('version', {
  state: (): VersionState => ({
    version: {
      folder: 'backend',
      name: 'pinia-test',
      someNumber: 3.1415,
      version: '1.2.30',
    } as StarterDto,
  }),
  actions: {
    async load() {
      const response = await fetch(`${baseUrl}/api/version`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      this.version = await response.json()
    },
  },
})
