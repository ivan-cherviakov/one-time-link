import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller'
import { OneTimeLinkModule } from './modules/one-time-link/one-time-link.module'
import { AppConfig, validateConfig } from './app.config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateConfig }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService<AppConfig>) => {
        return {
          uri: config.get('MONGO_URL'),
        }
      },
      inject: [ConfigService],
    }),
    OneTimeLinkModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
