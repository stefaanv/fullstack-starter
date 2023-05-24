import { Injectable } from '@nestjs/common'
import { watch } from 'fs/promises'
import { join } from 'path'
import { readFileSync } from 'fs'
import { ConfigService as NestConfigService } from '@nestjs/config'
import { CONFIG_FILE_NAME } from '@src/app.module'
import { FRONTEND_CONFIG_FILE_NAME } from '@src/app.module'

@Injectable()
export class ConfigService {
  private _config: any = {}
  private _configFullpath = join(
    __dirname,
    '../..',
    process.env.CONFIG_FOLDER ?? 'config',
    CONFIG_FILE_NAME,
  )
  private _feConfigFullpath = join(
    __dirname,
    '../..',
    process.env.CONFIG_FOLDER ?? 'config',
    FRONTEND_CONFIG_FILE_NAME,
  )
  constructor(private readonly _configService: NestConfigService) {
    this.loadConfig()
    this.startWatcher()
  }

  async startWatcher() {
    const watcher = watch(this._configFullpath)
    for await (const event of watcher) {
      this.loadConfig()
    }
  }

  async loadConfig() {
    // TODO also replace values from a secrets vault
    let content = readFileSync(this._configFullpath).toString()
    if (content) {
      const matches = content.match(/({{\w+}})/gm)
      if (matches) {
        for (const match of matches) {
          const value = process.env[match.replace(/{{|}}/g, '')]
          if (value) content = content.replace(new RegExp(`${match}`, 'gm'), value)
        }
      }
      this._config = JSON.parse(content)
    }
  }

  public get<T>(key: string, defaultValue: T | undefined) {
    const keys = key.split('.')
    let result = this._config
    for (const k of keys) {
      result = Object.getOwnPropertyNames(result).includes(k) ? result[k] : undefined
      if (result === undefined) return defaultValue
    }
    return result
  }

  public async getFrontendConfig() {
    const fn = (await import(this._feConfigFullpath)).default
    return fn(this._config)
  }
}
