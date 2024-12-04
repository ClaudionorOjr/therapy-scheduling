import 'reflect-metadata'

import { PrismaService } from '@infra/database/prisma'
import type { FastifyInstance } from 'fastify'
import { createAuthenticateUser } from 'test/create-authentocate-user'
import { PatientFactory } from 'test/factories/make-patient'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

describe('Delete patient (e2e)', () => {
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

  test('[DELETE] /patients/:patientId/delete', async () => {
    const { accessToken, psychologist } = await createAuthenticateUser(prisma)
    const patient = await patientFactory.makePrismaPatient({
      psychologistId: psychologist.id,
    })

    const response = await app.inject({
      method: 'DELETE',
      url: `/patients/${patient.id}/delete`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })

    const deletePatient = await prisma.patient.findUnique({
      where: { id: patient.id },
    })

    expect(response.statusCode).toBe(204)
    expect(deletePatient).toBeNull()
  })
})
