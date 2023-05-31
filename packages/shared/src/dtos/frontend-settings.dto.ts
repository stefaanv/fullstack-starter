import { VersionDto } from './version.dto'

export type FrontendConfigDto =
  | {
      windowTitle: string
      version: VersionDto
      appName: string
      appDescritption: string
    }
  | Record<string, any>
