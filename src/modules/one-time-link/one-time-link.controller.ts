import { Controller, Get, Post, Param, Body } from '@nestjs/common'

import { OneTimeLinkService } from './one-time-link.service'

@Controller('one-time-link')
export class OneTimeLinkController {
  constructor(private oneTimeLinkService: OneTimeLinkService) {}

  @Get('/:token')
  async use(@Param('token') token: string) {
    const contents = await this.oneTimeLinkService.use(token)

    return contents
  }

  @Post('/')
  async generate(@Body() body: { contents: string }) {
    const token = await this.oneTimeLinkService.generate(body.contents)

    return token
  }
}
