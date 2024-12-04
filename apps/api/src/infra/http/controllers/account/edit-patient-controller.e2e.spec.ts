import 'reflect-metadata'

import { PrismaService } from '@infra/database/prisma'
import type { FastifyInstance } from 'fastify'
import { createAuthenticateUser } from 'test/create-authentocate-user'
import { PatientFactory } from 'test/factories/make-patient'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

describe('Edit patient (e2e)', () => {
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

  test('[PUT] /patients/:patientId/edit', async () => {
    const { accessToken, psychologist } = await createAuthenticateUser(prisma)

    const patient = await patientFactory.makePrismaPatient({
      psychologistId: psychologist.id,
    })

    const payload = {
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      phone: '123456789',
      dateOfBirth: new Date('2001-05-12'),
      occupation: 'Teacher',
    }

    const response = await app.inject({
      method: 'PUT',
      url: `/patients/${patient.id}/edit`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      payload,
    })

    const updatedPatient = await prisma.patient.findFirst({
      where: {
        ...payload,
      },
    })

    expect(response.statusCode).toBe(204)
    expect(updatedPatient).toBeTruthy()
  })
})
