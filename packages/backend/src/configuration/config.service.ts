import { Injectable } from '@nestjs/common'
import { watch } from 'fs/promises'
import { join } from 'path'
import { readFileSync } from 'fs'

@Injectable()
export class ConfigService {
  private _config: any = {}
  private _configFullpath = join(__dirname, '../..', process.env.CONFIG_FILE ?? '')
  constructor() {
    this.loadConfig()
    this.startWatcher()
  }

  async startWatcher() {
    const watcher = watch(this._configFullpath)
    for await (const event of watcher) {
      console.log(event)
      this.loadConfig()
    }
  }

  async loadConfig() {
    const content = readFileSync(this._configFullpath)
    this._config = JSON.parse(content.toString())
    console.log(this._config)
  }
}
