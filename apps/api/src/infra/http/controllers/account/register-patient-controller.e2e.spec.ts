import 'reflect-metadata'

import { PrismaService } from '@infra/database/prisma'
import type { FastifyInstance } from 'fastify'
import { createAuthenticateUser } from 'test/create-authentocate-user'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

describe('Register patient (e2e)', () => {
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

  test('[POST] /patients/register', async () => {
    const { accessToken } = await createAuthenticateUser(prisma)

    const response = await app.inject({
      method: 'POST',
      url: `/patients/register`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        fullName: 'John Doe',
        email: 'johndoe@example.com',
        phone: '123456789',
        dateOfBirth: new Date(),
        occupation: 'Doctor',
        responsibles: [
          {
            fullName: 'Johnathan Doe',
            email: 'jhonathan@example.com',
            phone: '123456789',
            degreeOfKinship: 'Father',
          },
          {
            fullName: 'Johanna Doe',
            email: 'johanna@example.com',
            phone: '123456789',
            degreeOfKinship: 'Mother',
          },
        ],
      },
    })

    const patientOnDatabase = await prisma.patient.findFirst({
      where: {
        email: 'johndoe@example.com',
      },
      include: {
        responsibles: true,
      },
    })

    expect(patientOnDatabase).toBeTruthy()
    expect(response.statusCode).toBe(201)
    // expect(JSON.parse(response.body)).toEqual()
  })
})
