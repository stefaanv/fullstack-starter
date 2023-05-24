import { Injectable } from '@nestjs/common'
import { watch } from 'fs/promises'
import { join } from 'path'
import { readFileSync } from 'fs'
import { ConfigService as NestConfigService } from '@nestjs/config'

@Injectable()
export class ConfigService {
  private _config: any = {}
  private _configFullpath = join(__dirname, '../..', process.env.CONFIG_FILE ?? '')
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
    const content = readFileSync(this._configFullpath)
    this._config = JSON.parse(content.toString())
    console.log(this._config)
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
}
