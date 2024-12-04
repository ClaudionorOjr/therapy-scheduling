import { EditPatientUseCase } from '@domain/account/application/use-cases/edit-patient'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function editPatient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const editPatientBodySchema = z.object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
    occupation: z.string().optional(),
  })

  const editPatientParamsSchema = z.object({
    patientId: z.string().uuid(),
  })

  const { sub: psychologistId } = request.user

  const { fullName, email, phone, dateOfBirth, occupation } =
    editPatientBodySchema.parse(request.body)

  const { patientId } = editPatientParamsSchema.parse(request.params)

  const editPatientUseCase = container.resolve(EditPatientUseCase)

  const result = await editPatientUseCase.execute({
    patientId,
    psychologistId,
    fullName,
    email,
    phone,
    dateOfBirth,
    occupation,
  })

  if (result.isFailure()) {
    throw result.value
  }

  return reply.status(204).send()
}
