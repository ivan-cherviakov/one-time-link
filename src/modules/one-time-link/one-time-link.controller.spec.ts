import { Test, TestingModule } from '@nestjs/testing'

import { OneTimeLinkController } from './one-time-link.controller'
import { OneTimeLinkService } from './one-time-link.service'

describe('OneTimeLinkController', () => {
  describe('use', () => {
    let controller: OneTimeLinkController
    let service: { use: jest.Mock; generate: jest.Mock }

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [OneTimeLinkController],
      })
        .useMocker((token) => {
          if (token === OneTimeLinkService) {
            return { use: jest.fn(), generate: jest.fn() }
          }

          return token
        })
        .compile()

      controller = module.get<OneTimeLinkController>(OneTimeLinkController)
      service = module.get(OneTimeLinkService)
    })

    it('should return content behind active one-time-link', async () => {
      const contents = 'test'
      const testToken = 'test-token'
      service.generate.mockImplementation(() => testToken)
      service.use.mockImplementation((token) => {
        if (token === testToken) {
          return contents
        }

        return ''
      })
      const token = await controller.generate({ contents })

      const result = await controller.use(token)

      expect(result).toBe(contents)
    })
  })
})
