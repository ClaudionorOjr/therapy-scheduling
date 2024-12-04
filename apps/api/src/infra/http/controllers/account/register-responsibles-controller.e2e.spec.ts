import 'reflect-metadata'

import { PrismaService } from '@infra/database/prisma'
import type { FastifyInstance } from 'fastify'
import { createAuthenticateUser } from 'test/create-authentocate-user'
import { PatientFactory } from 'test/factories/make-patient'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

describe('Register responsible (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let patientFactory: PatientFactory

  beforeAll(async () => {
    app = (await import('src/infra/http/server')).app
    prisma = new PrismaService()
    patientFactory = new PatientFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /patients/:patientId/responsibles/register', async () => {
    const { accessToken, psychologist } = await createAuthenticateUser(prisma)

    const patient = await patientFactory.makePrismaPatient({
      psychologistId: psychologist.id,
    })

    const response = await app.inject({
      method: 'POST',
      url: `/patients/${patient.id}/responsibles/register`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload: {
        responsibles: [
          {
            fullName: 'John Doe',
            email: 'johndoe@example.com',
            phone: '123456789',
            degreeOfKinship: 'Father',
          },
          {
            fullName: 'Johanna Doe',
            email: 'johannadoe@example.com',
            phone: '123456789',
            degreeOfKinship: 'Mother',
          },
        ],
      },
    })

    const responsiblesOnDatabase = await prisma.responsible.findMany()

    expect(response.statusCode).toBe(201)
    expect(responsiblesOnDatabase).toHaveLength(2)
  })
})
