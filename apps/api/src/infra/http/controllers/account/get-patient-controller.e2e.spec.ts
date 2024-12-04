import 'reflect-metadata'

import { PrismaService } from '@infra/database/prisma'
import type { FastifyInstance } from 'fastify'
import { createAuthenticateUser } from 'test/create-authentocate-user'
import { PatientFactory } from 'test/factories/make-patient'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import type { GetPatientControllerResponse } from './get-patient-controller'

describe('Get patient (e2e)', () => {
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

  test('[GET] /patients/:patientId', async () => {
    const { accessToken, psychologist } = await createAuthenticateUser(prisma)

    const patient = await patientFactory.makePrismaPatient({
      psychologistId: psychologist.id,
    })

    const response = await app.inject({
      method: 'GET',
      url: `/patients/${patient.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })

    const body = response.json<GetPatientControllerResponse>()

    expect(response.statusCode).toBe(200)
    expect(body).toEqual({
      patient: expect.objectContaining({
        _id: patient.id,
      }),
    })
  })
})
