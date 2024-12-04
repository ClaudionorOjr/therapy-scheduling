import { FetchPatientsUseCase } from '@domain/account/application/use-cases/fetch-patients'
import type { Patient } from '@domain/account/enterprise/entities/patient'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

export interface FetchPatientsControllerResponse {
  patients: Patient[]
}

export async function fetchPatients(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FetchPatientsControllerResponse> {
  const { sub: psychologistId } = request.user

  const fetchPatientsUseCase = container.resolve(FetchPatientsUseCase)

  const result = await fetchPatientsUseCase.execute({
    psychologistId,
  })

  if (result.isFailure()) {
    throw result.value
  }

  const { patients } = result.value
  return reply.status(200).send({ patients })
}
