import { Injectable } from '@nestjs/common'
import { watch } from 'fs/promises'
import { join } from 'path'
import { readFileSync } from 'fs'
import { ConfigService as NestConfigService } from '@nestjs/config'
import { APP_DESCRIPTION, CONFIG_FILE_NAME } from '@src/app.module'
import { FRONTEND_CONFIG_FILE_NAME, APP_NAME } from '@src/app.module'
import { VersionDto } from '@nest-vue-starter/shared'
import * as childProcess from 'child_process'

const ROOT_PACKAGE_REL_FOLDER_DEV = '../../../../package.json'
const ROOT_PACKAGE_REL_FOLDER_OTHER = './package.json' //TODO nog aanpassen
type PackageJson = { name: string; version: string; author: string; description: string }

@Injectable()
export class ConfigService {
  private _config: any = {}
  private _configFullpath: string
  private _feConfigFullpath: string
  private _rootPackageJsonFullpath: string
  public appInfo = new VersionDto()

  constructor(private readonly _configService: NestConfigService) {
    const configFolder = join(__dirname, '../..', process.env.CONFIG_FOLDER ?? 'config')
    this._configFullpath = join(configFolder, CONFIG_FILE_NAME)
    this._feConfigFullpath = join(configFolder, FRONTEND_CONFIG_FILE_NAME)
    const packageJsonRootPath = process.env.NODE_ENV?.toLowerCase().startsWith('dev')
      ? ROOT_PACKAGE_REL_FOLDER_DEV
      : ROOT_PACKAGE_REL_FOLDER_OTHER
    this._rootPackageJsonFullpath = join(__dirname, packageJsonRootPath)
  }

  async startWatcher() {
    const watcher = watch(this._configFullpath)
    for await (const event of watcher) {
      this.bootstrap()
    }
  }

  async readPackageJson() {
    console.log(this._rootPackageJsonFullpath)
    const content = readFileSync(this._rootPackageJsonFullpath).toString()
    const pkg: PackageJson = JSON.parse(content)
    this.appInfo.setPackageInfo(pkg)
  }

  async bootstrap() {
    this.readPackageJson()
    this.appInfo.commitId = this.getCommitId()
    // TODO also replace values from a secrets vault
    let content = readFileSync(this._configFullpath).toString()
    if (content) {
      const matches = content.match(/({{\w+}})/gm)
      if (matches) {
        for (const match of matches) {
          const value =
            match === '{{APP_DESCRIPTION}}'
              ? APP_DESCRIPTION
              : match === '{{APP_NAME}}'
              ? APP_NAME
              : process.env[match.replace(/{{|}}/g, '')]
          if (value) content = content.replace(new RegExp(`${match}`, 'gm'), value)
        }
      }
      this._config = JSON.parse(content)
    }
    this.startWatcher()
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
