import { GetPatientUseCase } from '@domain/account/application/use-cases/get-patient'
import type { Patient } from '@domain/account/enterprise/entities/patient'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export interface GetPatientControllerResponse {
  patient: Patient
}

export async function getPatient(request: FastifyRequest, reply: FastifyReply) {
  const getPatientParamsSchema = z.object({
    patientId: z.string().uuid(),
  })

  const { patientId } = getPatientParamsSchema.parse(request.params)

  const { sub: psychologistId } = request.user

  const getPatientUseCase = container.resolve(GetPatientUseCase)

  const result = await getPatientUseCase.execute({
    patientId,
    psychologistId,
  })

  if (result.isFailure()) {
    throw result.value
  }

  const { patient } = result.value

  return reply.status(200).send({ patient })
}
