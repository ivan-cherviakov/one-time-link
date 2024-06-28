import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { AppConfig } from './app.config'

async function bootstrap() {
  const logger = new Logger(bootstrap.name)
  const config = new ConfigService<AppConfig>(AppConfig)

  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())

  const swaggerConfig = new DocumentBuilder()
    .setTitle('One time link')
    .setDescription('API for one time links')
    .setVersion('1.0')
    .addTag('one-time-link')
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('swagger', app, swaggerDocument)

  await app.listen(config.get('PORT'))
  logger.debug(`server listening on ${config.get('PORT')}`)
}
bootstrap()
