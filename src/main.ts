import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'
import { AppConfig } from './app.config'

async function bootstrap() {
  const logger = new Logger(bootstrap.name)
  const config = new ConfigService<AppConfig>(AppConfig)
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(config.get('PORT'))
  logger.debug(`server listening on ${config.get('PORT')}`)
}
bootstrap()
