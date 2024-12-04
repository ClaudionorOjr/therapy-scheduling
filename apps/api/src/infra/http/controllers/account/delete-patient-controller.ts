import { DeletePatientUseCase } from '@domain/account/application/use-cases/delete-patient'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function deletePatient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deletePatientParamsSchema = z.object({
    patientId: z.string().uuid(),
  })

  const { patientId } = deletePatientParamsSchema.parse(request.params)

  const { sub: psychologistId } = request.user

  const deletePatientUseCase = container.resolve(DeletePatientUseCase)

  const result = await deletePatientUseCase.execute({
    patientId,
    psychologistId,
  })

  if (result.isFailure()) {
    throw result.value
  }

  return reply.status(204).send()
}
