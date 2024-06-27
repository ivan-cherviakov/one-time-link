import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import * as request from 'supertest'
import { Model } from 'mongoose'

import { AppModule } from './../src/app.module'
import { OneTimeLink } from './../src/modules/one-time-link/one-time-link.schema'

function isFulfilled<T>(
  input: PromiseSettledResult<T>,
): input is PromiseFulfilledResult<T> {
  return input.status === 'fulfilled'
}

describe('OneTimeLink (integration)', () => {
  describe('GET /one-time-link/:token', () => {
    let app: INestApplication
    let agent
    let model

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile()

      app = moduleFixture.createNestApplication()
      model = app.get<Model<OneTimeLink>>(getModelToken(OneTimeLink.name))
      agent = request(app.getHttpServer())
      await app.init()
    })

    afterEach(async () => {
      await model.deleteMany({})
      await app.close()
    })

    it('should return content behind token', async () => {
      const contents = 'test'
      const token = 'test-token'
      await model.create({ contents, token })

      const result = await agent.get(`/one-time-link/${token}`)

      expect(result.status).toBe(200)
      expect(result.text).toBe(contents)
    })

    it('should return bad request error if token not found', async () => {
      const token = 'test-token'

      const result = await agent.get(`/one-time-link/${token}`)

      expect(result.status).toBe(404)
      expect(result.text).toContain(`link ${token} not found or already used`)
    })

    it('should return bad request error if token already used', async () => {
      const contents = 'test'
      const token = 'test-token'
      await model.create({ contents, token, is_active: false })

      const result = await agent.get(`/one-time-link/${token}`)

      expect(result.status).toBe(404)
      expect(result.text).toContain(`link ${token} not found or already used`)
    })

    it('should return content behind token only once', async () => {
      const contents = 'test'
      const token = 'test-token'
      await model.create({ contents, token })

      const result = await agent.get(`/one-time-link/${token}`)

      expect(result.status).toBe(200)
      expect(result.text).toBe(contents)

      const secondResult = await agent.get(`/one-time-link/${token}`)

      expect(secondResult.status).toBe(404)
      expect(secondResult.text).toContain(
        `link ${token} not found or already used`,
      )
    })

    it('should allow only one from two simultaneous requests to succeed', async () => {
      const contents = 'test'
      const token = 'test-token'
      await model.create({ contents, token })

      const result = await Promise.allSettled([
        await agent.get(`/one-time-link/${token}`),
        await agent.get(`/one-time-link/${token}`),
      ])

      const success = result.filter(
        (res) => isFulfilled(res) && res.value.status === 200,
      )
      const failure = result.filter(
        (res) => isFulfilled(res) && res.value.status === 404,
      )
      expect(success).toHaveLength(1)
      expect(failure).toHaveLength(1)
    })
  })

  describe('POST /one-time-link', () => {
    let app: INestApplication
    let agent
    let model

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile()

      app = moduleFixture.createNestApplication()
      model = app.get<Model<OneTimeLink>>(getModelToken(OneTimeLink.name))
      agent = request(app.getHttpServer())
      await app.init()
    })

    afterEach(async () => {
      await model.deleteMany({})
      await app.close()
    })

    it('should return generated link for content passed', async () => {
      const contents = 'test'

      const result = await agent
        .post('/one-time-link')
        .set('Content-Type', 'application/json')
        .send({ contents })

      expect(result.status).toBe(201)
      expect(result.text.length).toBeGreaterThan(0)
      expect(result.text).not.toBe(contents)
    })

    it('should save document with contents in database', async () => {
      const contents = 'test'

      const result = await agent
        .post('/one-time-link')
        .set('Content-Type', 'application/json')
        .send({ contents })

      expect(result.status).toBe(201)
      const link = await model.findOne({ contents })
      expect(link).not.toBeNull()
      expect(link.is_active).toBe(true)
    })

    it('should return bad request exception if active link for content already exist', async () => {
      const contents = 'test'
      const token = 'test-token'
      await model.create({ contents, token })

      const result = await agent
        .post('/one-time-link')
        .set('Content-Type', 'application/json')
        .send({ contents })

      expect(result.status).toBe(400)
      expect(result.text).toContain(
        `link for string ${contents} already exists`,
      )
    })

    it('should generate new link, if old one already used', async () => {
      const contents = 'test'
      const firstResult = await agent
        .post('/one-time-link')
        .set('Content-Type', 'application/json')
        .send({ contents })

      await model.updateOne(
        { token: firstResult.text },
        { $set: { is_active: false } },
      )

      const secondResult = await agent
        .post('/one-time-link')
        .set('Content-Type', 'application/json')
        .send({ contents })

      expect(secondResult.status).toBe(201)
      expect(secondResult.text.length).toBeGreaterThan(0)
      expect(secondResult.text).not.toBe(contents)
      expect(secondResult.text).not.toBe(firstResult.text)
    })

    it('should only allow one of two simultaneous requests to succeed', async () => {
      const contents = 'test'

      const result = await Promise.allSettled([
        await agent
          .post('/one-time-link')
          .set('Content-Type', 'application/json')
          .send({ contents }),
        await agent
          .post('/one-time-link')
          .set('Content-Type', 'application/json')
          .send({ contents }),
      ])

      const success = result.filter(
        (res) => isFulfilled(res) && res.value.status === 201,
      )
      const failure = result.filter(
        (res) => isFulfilled(res) && res.value.status === 400,
      )
      expect(success).toHaveLength(1)
      expect(failure).toHaveLength(1)
    })
  })
})
