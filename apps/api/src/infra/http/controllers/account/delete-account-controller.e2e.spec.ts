import 'reflect-metadata'

import { PrismaService } from '@infra/database/prisma'
import type { FastifyInstance } from 'fastify'
import { createAuthenticateUser } from 'test/create-authentocate-user'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

describe('Delete account (e2e)', () => {
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

  test('[DELETE] /psychologists/delete', async () => {
    const { accessToken } = await createAuthenticateUser(prisma)

    const response = await app.inject({
      method: 'DELETE',
      url: '/psychologists/delete',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })

    expect(response.statusCode).toBe(204)
  })
})
