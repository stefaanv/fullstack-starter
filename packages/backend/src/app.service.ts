import { Injectable } from '@nestjs/common'
import { ConfigService } from '@src/configuration/config.service'
import { LogService } from '@src/logging/log.service'
import * as childProcess from 'child_process'
import { APP_NAME } from '@src/app.module'

@Injectable()
export class AppService {
  constructor(private readonly _log: LogService, private readonly _config: ConfigService) {
    this._log.context = AppService.name
  }

  get name() {
    return APP_NAME
  }

  get commitId() {
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

  get version() {
    return {
      name: this.name,
      version: process.env.npm_package_version,
      commitId: this.commitId,
    }
  }
}
