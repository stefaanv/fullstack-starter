import { Injectable } from '@nestjs/common'
import { ConfigService } from '@src/configuration/config.service'
import { LogService } from '@src/logging/log.service'

@Injectable()
export class AppService {
  constructor(private readonly _log: LogService, private readonly _config: ConfigService) {
    this._log.context = AppService.name
  }
}
