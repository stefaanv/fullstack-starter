import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@src/configuration/config.service'
import { LogService } from '@src/logging/log.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  const config = app.get(ConfigService)
  await config.bootstrap()
  const testVar = config.get<string>('test')
  console.log(testVar)
  const port = parseInt(config.get<string>('port', '3005'))
  const globalApiPrefix = config.get<string>('api-prefix', 'api')
  app.setGlobalPrefix(globalApiPrefix)
  const log = await app.resolve(LogService)

  log.info(`Starting ${config.appInfo.appName} v${config.appInfo.version}`)
  log.info(`Start listening to port ${port}, api prefix is '${globalApiPrefix}'`, {
    context: 'main',
  })
  await app.listen(port)
}
bootstrap()
