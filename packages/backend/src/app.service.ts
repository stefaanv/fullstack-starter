import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LogFacade } from './logging/logger'
import { VersionService } from './version/version.service'

@Injectable()
export class AppService {
  constructor(
    private readonly _log: LogFacade,
    private readonly _versionService: VersionService,
    private readonly _config: ConfigService,
  ) {
    this._log.context = AppService.name
    this._log.log('constructing AppService class')
  }

  getVersion() {
    return this._versionService.all
  }
}
