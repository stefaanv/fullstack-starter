import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigService } from './configuration/config.service'

@Controller('/')
export class AppController {
  constructor(private readonly _appService: AppService, private readonly _config: ConfigService) {}

  @Get('version')
  getVersion() {
    return this._appService.version
  }

  @Get('config')
  async getFrontendConfig() {
    return this._config.getFrontendConfig()
  }
}
