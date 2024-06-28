import { Controller, Get, Post, Param, Body } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

import { OneTimeLinkService } from './one-time-link.service'
import { GenerateBodyDTO } from './one-time-link.dto'

@Controller('one-time-link')
export class OneTimeLinkController {
  constructor(private oneTimeLinkService: OneTimeLinkService) {}

  @ApiResponse({
    status: 200,
    description: 'returns contents by existing active token',
  })
  @ApiResponse({ status: 404, description: 'token not exist or already used' })
  @Get('/:token')
  async use(@Param('token') token: string) {
    const contents = await this.oneTimeLinkService.use(token)

    return contents
  }

  @ApiResponse({
    status: 201,
    description:
      'returns token, which can be used one time to retrieve contents',
  })
  @ApiResponse({
    status: 400,
    description:
      'cannot generate token for same content twice, unless token generated already used',
  })
  @Post('/')
  async generate(@Body() body: GenerateBodyDTO) {
    const token = await this.oneTimeLinkService.generate(body.contents)

    return token
  }
}
