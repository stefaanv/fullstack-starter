import { Module, Scope } from '@nestjs/common'
import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { ConfigModule } from '@nestjs/config'
import { LogFacade } from '@src/logging/logger'
import { ConfigService } from '@src/configuration/config.service'

export const APP_NAME = 'fullstack-starter'
export const APP_DESCRIPTION = 'Nest.js/Vue3/Typescript fullstack starter'
export const CONFIG_FILE_NAME = 'config.json'
export const FRONTEND_CONFIG_FILE_NAME = 'backend-config-to-frontend.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveStaticOptions: {
        index: 'index.html',
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: LogFacade,
      useClass: LogFacade,
      scope: Scope.TRANSIENT,
    },
    ConfigService,
    AppService,
  ],
})
export class AppModule {}
