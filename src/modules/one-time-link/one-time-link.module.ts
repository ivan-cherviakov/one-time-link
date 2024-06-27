import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OneTimeLinkController } from './one-time-link.controller'
import { OneTimeLinkService } from './one-time-link.service'
import { OneTimeLinkModelDefinition } from './one-time-link.schema'

@Module({
  imports: [MongooseModule.forFeature([OneTimeLinkModelDefinition])],
  controllers: [OneTimeLinkController],
  providers: [OneTimeLinkService],
})
export class OneTimeLinkModule {}
