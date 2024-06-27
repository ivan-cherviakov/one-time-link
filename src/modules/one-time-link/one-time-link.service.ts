import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import { OneTimeLink } from './one-time-link.schema'

@Injectable()
export class OneTimeLinkService {
  private logger = new Logger(OneTimeLinkService.name)

  constructor(
    @InjectModel(OneTimeLink.name) private oneTimeLinkModel: Model<OneTimeLink>,
  ) {}

  public async generate(contents: string) {
    const existingLink = await this.oneTimeLinkModel.findOne(
      { contents, is_active: true },
      { _id: 1 },
    )
    if (existingLink) {
      throw new BadRequestException(
        `link for string ${contents} already exists`,
      )
    }

    const token = uuidv4()
    await this.oneTimeLinkModel.create({ contents, token })
    this.logger.debug(`created link ${token} for contents ${contents}`)

    return token
  }

  public async use(token: string) {
    const link = await this.oneTimeLinkModel.findOneAndUpdate(
      { token, is_active: true },
      { $set: { is_active: false } },
      { new: true },
    )
    if (!link) {
      throw new NotFoundException(`link ${token} not found or already used`)
    }
    this.logger.debug(`link ${token} used`)

    return link.contents
  }
}
