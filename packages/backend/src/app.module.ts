import { Module, Scope } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { ConfigModule } from '@nestjs/config'
import { LogFacade } from './logging/logger'
import { ConfigService } from './configuration/config.service'

export const APP_NAME = 'fullstack-starter'
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
