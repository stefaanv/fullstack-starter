import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @Get('version')
  getVersion() {
    return this._appService.version
  }
}
