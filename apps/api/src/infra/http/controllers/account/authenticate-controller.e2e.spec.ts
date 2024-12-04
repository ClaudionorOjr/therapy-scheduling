import 'reflect-metadata'

import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'
import { PrismaService } from '@infra/database/prisma'
import type { FastifyInstance } from 'fastify'
import { PsychologistFactory } from 'test/factories/make-psychologist'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

describe('Authenticate (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let hasher: BcryptHasher
  let psychologistFactory: PsychologistFactory

  beforeAll(async () => {
    app = (await import('src/infra/http/server')).app
    prisma = new PrismaService()
    hasher = new BcryptHasher()
    psychologistFactory = new PsychologistFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /sessions', async () => {
    await psychologistFactory.makePrismaPsychologist({
      email: 'johndoe@example.com',
      passwordHash: await hasher.hash('123456'),
    })

    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: { email: 'johndoe@example.com', password: '123456' },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      accessToken: expect.any(String),
    })
  })
})
