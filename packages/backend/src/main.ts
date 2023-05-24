import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
// import { ConfigService } from '@nestjs/config'
import { ConfigService } from './configuration/config.service'
import { LogFacade } from './logging/logger'
import { AppService } from './app.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  const config = app.get(ConfigService)
  const port = parseInt(config.get<string>('PORT', '3005'))
  const globalApiPrefix = config.get<string>('API_PREFIX', 'api')
  app.setGlobalPrefix(globalApiPrefix)
  const version = app.get(AppService).version
  const log = await app.resolve(LogFacade)

  log.log(`Starting ${version.name} v${version.version}`, { meta: version })
  log.log(`Start listening to port ${port}`, { context: 'main' })
  await app.listen(port)
}
bootstrap()
