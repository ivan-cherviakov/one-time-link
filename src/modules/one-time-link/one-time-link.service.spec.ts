import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'

import { OneTimeLinkService } from './one-time-link.service'
import { OneTimeLink } from './one-time-link.schema'

describe(OneTimeLinkService.name, () => {
  describe('generate', () => {
    let service: OneTimeLinkService
    let model: { findOne: jest.Mock; create: jest.Mock }

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [OneTimeLinkService],
      })
        .useMocker((token) => {
          if (token === getModelToken(OneTimeLink.name)) {
            return { findOne: jest.fn(), create: jest.fn() }
          }

          return token
        })
        .compile()

      service = module.get<OneTimeLinkService>(OneTimeLinkService)
      model = module.get(getModelToken(OneTimeLink.name))
    })

    it('should generate and return token for given contents', async () => {
      const contents = 'test'

      const result = await service.generate(contents)

      expect(typeof result === 'string').toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result).not.toBe(contents)
    })

    it('should throw bad request error if link for contents already exists', async () => {
      const contents = 'test'
      model.findOne.mockImplementation((filter) => {
        if (filter.contents === contents) {
          return {}
        }

        return null
      })

      await expect(service.generate(contents)).rejects.toThrow(
        new BadRequestException(`link for string ${contents} already exists`),
      )
    })
  })

  describe('use', () => {
    let service: OneTimeLinkService
    let model: { findOneAndUpdate: jest.Mock }

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [OneTimeLinkService],
      })
        .useMocker((token) => {
          if (token === getModelToken(OneTimeLink.name)) {
            return { findOneAndUpdate: jest.fn() }
          }

          return token
        })
        .compile()

      service = module.get<OneTimeLinkService>(OneTimeLinkService)
      model = module.get(getModelToken(OneTimeLink.name))
    })

    it('should return content by token', async () => {
      const token = 'test-token'
      const contents = 'test'
      model.findOneAndUpdate.mockImplementation((filter) => {
        if (filter.token === token) {
          return { contents }
        }

        return null
      })

      const result = await service.use(token)

      expect(result).toBe(contents)
    })

    it('should throw error if token not found', async () => {
      const token = 'test-token'
      const contents = 'test'
      const anotherToken = 'another-token'
      model.findOneAndUpdate.mockImplementation((filter) => {
        if (filter.token === token) {
          return { contents }
        }

        return null
      })

      await expect(service.use(anotherToken)).rejects.toThrow(
        new NotFoundException(`link ${anotherToken} not found or already used`),
      )
    })
  })
})
