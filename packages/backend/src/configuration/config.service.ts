import { Inject, Injectable } from '@nestjs/common'
import { watch } from 'fs/promises'
import { join } from 'path'
import { readFileSync } from 'fs'
import { ConfigService as NestConfigService } from '@nestjs/config'
import { CONFIG_FILE_NAME, CONFIG_SETTINGS_TOKEN, FRONTEND_CONFIG_FILE_NAME } from '@src/app.module'
import { AppInfoDto, ensureError } from '@nest-vue-starter/shared'
import * as childProcess from 'child_process'
import { LogService } from '@src/logging/log.service'

const ROOT_PACKAGE_REL_FOLDER_DEV = '../../../../package.json'
const ROOT_PACKAGE_REL_FOLDER_OTHER = './package.json' //TODO nog aanpassen
type PackageJson = { name: string; version: string; author: string; description: string }

export type ConfigOrigin = 'javascript' | 'json' | 'infisical'
export type ConfigBaseSettingsBase = { origin: ConfigOrigin; dynamic: boolean }
export type FileConfigSettings = ConfigBaseSettingsBase & {
  configFileRelativePath: string
}
export type InfisicalConfigSettings = ConfigBaseSettingsBase & {
  configHost: string
}

const APP_INFO_KEYS = {}

@Injectable()
export class ConfigService {
  private _content: { appInfo: AppInfoDto } | Record<string, unknown> = {}
  private _configFullpath: string
  private _feConfigFullpath: string
  private _rootPackageJsonFullpath: string
  public appInfo = new AppInfoDto()

  constructor(
    private readonly _configService: NestConfigService,
    private readonly _log: LogService,
    @Inject('CONFIG_SETTINGS') private readonly _configSettings: ConfigBaseSettingsBase,
  ) {
    const configFolder = join(__dirname, '../..', process.env.CONFIG_FOLDER ?? 'test')
    this._configFullpath = join(configFolder, CONFIG_FILE_NAME)
    this._feConfigFullpath = join(configFolder, FRONTEND_CONFIG_FILE_NAME)
    const packageJsonRootPath = process.env.NODE_ENV?.toLowerCase().startsWith('dev')
      ? ROOT_PACKAGE_REL_FOLDER_DEV
      : ROOT_PACKAGE_REL_FOLDER_OTHER
    this._rootPackageJsonFullpath = join(__dirname, packageJsonRootPath)
  }

  async startWatcher() {
    try {
      const watcher = watch(this._configFullpath)
      for await (const event of watcher) {
        this.bootstrap()
      }
    } catch (err) {
      const error = ensureError(err)
      this._log.error(`Unable to watch config folder - "${error.message}"`)
    }
  }

  async readPackageJson() {
    const content = readFileSync(this._rootPackageJsonFullpath).toString()
    const pkg: PackageJson = JSON.parse(content)
    this.appInfo.setPackageInfo(pkg)
  }

  get configFileFullPath(): string {
    if (!['javascript', 'json'].includes(this._configSettings.origin)) {
      throw new Error(`not allowed for config type ${this._configSettings.origin}`)
    }
    const relativePath = (this._configSettings as FileConfigSettings).configFileRelativePath
    return join(__dirname, '..', relativePath)
  }

  async bootstrap() {
    this.readPackageJson()
    this.appInfo.commitId = this.getCommitId()
    switch (this._configSettings.origin) {
      case 'json':
        this._content = await this.readJsonFile()
        break
      case 'javascript':
        this._content = await this.readJavascriptFile()
        break
      case 'infisical':
        throw new Error('Infisical config origin not implemented yet')
        break
    }
    if (this._configSettings.dynamic) this.startWatcher()
  }

  private async readJavascriptFile() {
    const file = this.configFileFullPath
    const configModule = await import(file)
    const result = configModule.default()
    return result
  }

  private async readJsonFile() {
    let content = '{}'
    // TODO also replace values from a secrets vault
    try {
      content = readFileSync(this._configFullpath).toString()
    } catch (err) {
      const error = ensureError(err)
      this._log.error(`Configuration file not found - "${error.message}"`)
    }
    if (content) {
      const matches = content.match(/({{\w+}})/gm)
      if (matches) {
        for (const match of matches) {
          const value = process.env[match.replace(/{{|}}/g, '')]
          if (value) content = content.replace(new RegExp(`${match}`, 'gm'), value)
        }
      }
      return JSON.parse(content)
    }
  }

  getCommitId() {
    if (process.env.COMMIT) return process.env.COMMIT
    if (process.env.NODE_ENV?.startsWith('dev')) {
      try {
        return childProcess.execSync('git rev-parse --short HEAD').toString().trim()
      } catch (error) {
        return 'no-git-repo'
      }
    }
    return 'unknown'
  }

  public get<T>(keyChain: string, defaultValue?: T | undefined) {
    //TODO: radash gebruiken voor keychain
    let result: any = this._content
    for (const k of keyChain.split('.')) {
      if (!Object.getOwnPropertyNames(this._content).includes(k)) {
        result = undefined
        break
      } else {
        const tuple = Object.entries(this._content).find(([key, value]) => key === k)
        result = tuple ? (tuple[1] as T) : undefined
      }
    }
    return result ?? defaultValue
  }

  public async getFrontendConfig() {
    const fn = (await import(this._feConfigFullpath)).default
    const feConfig = { ...fn(this._content), appInfo: this.appInfo }
    return feConfig
  }
}
