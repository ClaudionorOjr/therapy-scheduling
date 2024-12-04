import 'reflect-metadata'

import { PrismaService } from '@infra/database/prisma'
import type { FastifyInstance } from 'fastify'
import { createAuthenticateUser } from 'test/create-authentocate-user'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

describe('Edit psychologist (e2e)', () => {
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

  test('[PUT] /psychologists/update', async () => {
    const { accessToken } = await createAuthenticateUser(prisma)

    const response = await app.inject({
      method: 'PUT',
      url: `/psychologists/update`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        fullName: 'John Doe',
        phone: '11999999999',
        dateOfBirth: new Date('2000-01-01'),
      },
    })

    const psychologistOnDatabase = await prisma.psychologist.findFirst({
      where: {
        fullName: 'John Doe',
        phone: '11999999999',
        dateOfBirth: new Date('2000-01-01'),
      },
    })

    expect(response.statusCode).toBe(204)
    expect(psychologistOnDatabase).toBeTruthy()
  })
})
