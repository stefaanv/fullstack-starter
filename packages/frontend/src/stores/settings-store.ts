import { FrontendConfigDto, VersionDto } from '@nest-vue-starter/shared'
import axios from 'axios'
import { defineStore } from 'pinia'

interface SettingsState {
  version: VersionDto
  config: FrontendConfigDto
}

export const useSettingsStore = defineStore('version', {
  state: (): SettingsState => ({
    version: {} as VersionDto,
    config: {},
  }),
  actions: {
    load: loadVersionAndConfig,
  },
})

async function loadVersionAndConfig(): Promise<SettingsState> {
  const vResult = await axios.get<VersionDto>('version')
  const cResult = await axios.get<FrontendConfigDto>('config')
  console.log(cResult.data)
  return { version: vResult.data, config: cResult.data }
}
