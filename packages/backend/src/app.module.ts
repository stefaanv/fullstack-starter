import { Module, Scope } from '@nestjs/common'
import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { ConfigModule } from '@nestjs/config'
import { LogService } from '@src/logging/log.service'
import { ConfigService, FileConfigSettings } from '@src/configuration/config.service'

export const CONFIG_FILE_NAME = 'config.json'
export const FRONTEND_CONFIG_FILE_NAME = 'backend-config-to-frontend.js'
export const CONFIG_SETTINGS_TOKEN = Symbol('CONFIG_SETTINGS')

const CONFIG_SETTINGS: FileConfigSettings = {
  origin: 'javascript',
  dynamic: false,
  configFileRelativePath: 'configuration/config.js',
}

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
      provide: LogService,
      useClass: LogService,
      scope: Scope.TRANSIENT,
    },
    {
      provide: 'CONFIG_SETTINGS',
      useValue: CONFIG_SETTINGS,
    },
    ConfigService,
    AppService,
  ],
})
export class AppModule {}
