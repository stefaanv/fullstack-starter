import { Injectable } from '@nestjs/common'
import * as childProcess from 'child_process'
import { APP_NAME } from 'src/app.module'

@Injectable()
export class VersionService {
  get name() {
    return APP_NAME
  }

  get version() {
    return process.env.npm_package_version
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

  get all() {
    return {
      name: this.name,
      version: this.version,
      commitId: this.commitId,
    }
  }
}
