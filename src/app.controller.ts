import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('/healthcheck')
  ping(): string {
    return 'Ok'
  }
}
