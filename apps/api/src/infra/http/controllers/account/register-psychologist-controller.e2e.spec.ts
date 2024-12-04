import 'reflect-metadata'

import type { FastifyInstance } from 'fastify'
import { PrismaService } from 'src/infra/database/prisma'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register psychologist (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService

  beforeAll(async () => {
    app = (await import('src/infra/http/server')).app
    prisma = new PrismaService()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[POST] /psychologists/register', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/psychologists/register`,
      payload: {
        fullName: 'John Doe',
        email: 'KuF9v@example.com',
        password: '123456',
        dateOfBirth: new Date(),
        phone: '123456789',
        crp: '123456',
      },
    })

    expect(response.statusCode).toEqual(201)

    const psychologistOnDatabase = await prisma.psychologist.findUnique({
      where: { email: 'KuF9v@example.com' },
    })

    expect(psychologistOnDatabase).toBeTruthy()
  })
})
