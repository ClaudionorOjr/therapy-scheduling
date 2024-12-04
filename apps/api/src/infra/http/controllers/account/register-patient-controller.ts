import { RegisterPatientUseCase } from '@domain/account/application/use-cases/register-patient'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function registerPatient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerPatientBodySchema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    dateOfBirth: z.coerce.date(),
    occupation: z.string().nullish(),
    responsibles: z.array(
      z.object({
        fullName: z.string(),
        email: z.string(),
        phone: z.string(),
        degreeOfKinship: z.string(),
      }),
    ),
  })

  const { fullName, email, phone, dateOfBirth, occupation, responsibles } =
    registerPatientBodySchema.parse(request.body)

  const { sub: psychologistId } = request.user

  const registerPatientUseCase = container.resolve(RegisterPatientUseCase)

  const result = await registerPatientUseCase.execute({
    psychologistId,
    fullName,
    email,
    phone,
    dateOfBirth,
    occupation,
    responsibles,
  })

  if (result.isFailure()) {
    throw result.value
  }

  return reply.status(201).send()
}
