import { Controller, Get } from '@nestjs/common'
import { VersionService } from './version/version.service'
import { StarterDto } from '@nest-vue-starter/shared'

@Controller()
export class AppController {
  constructor(private readonly _versionService: VersionService) {}

  @Get('version')
  getVersion() {
    const dto = new StarterDto()
    return { ...this._versionService.all, ...dto }
  }
}
