import { Controller, Get } from '@nestjs/common'
import { VersionService } from './version/version.service'

@Controller()
export class AppController {
  constructor(private readonly versionService: VersionService) {}

  @Get('version')
  getVersion() {
    return this.versionService.all
  }
}
