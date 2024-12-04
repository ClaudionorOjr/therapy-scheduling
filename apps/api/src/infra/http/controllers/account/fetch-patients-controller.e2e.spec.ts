import 'reflect-metadata'

import { PrismaService } from '@infra/database/prisma'
import type { FastifyInstance } from 'fastify'
import { createAuthenticateUser } from 'test/create-authentocate-user'
import { PatientFactory } from 'test/factories/make-patient'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import type { FetchPatientsControllerResponse } from './fetch-patients-controller'

describe('Fetch patients (e2e)', () => {
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

  test('[GET] /patients', async () => {
    const { accessToken, psychologist } = await createAuthenticateUser(prisma)

    const [patient1, patient2, patient3] = await Promise.all([
      patientFactory.makePrismaPatient({ psychologistId: psychologist.id }),
      patientFactory.makePrismaPatient({ psychologistId: psychologist.id }),
      patientFactory.makePrismaPatient({ psychologistId: psychologist.id }),
    ])

    const response = await app.inject({
      method: 'GET',
      url: '/patients',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })

    const body = response.json<FetchPatientsControllerResponse>()

    expect(response.statusCode).toBe(200)

    // TODO Alterar a chave `_id` após criar o `presenter` para esse controller.
    expect(body).toEqual({
      patients: expect.arrayContaining([
        expect.objectContaining({
          _id: patient1.id,
        }),
        expect.objectContaining({
          _id: patient2.id,
        }),
        expect.objectContaining({
          _id: patient3.id,
        }),
      ]),
    })
  })
})
