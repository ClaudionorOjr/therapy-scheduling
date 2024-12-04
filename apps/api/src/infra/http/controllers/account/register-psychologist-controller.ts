import { RegisterPsychologistUseCase } from '@domain/account/application/use-cases/register-psychologist'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function registerPsychologist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerPsychologistBodySchema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    password: z.coerce.string().min(6),
    dateOfBirth: z.coerce.date(),
    phone: z.string(),
    crp: z.string(),
  })

  const { fullName, email, password, dateOfBirth, phone, crp } =
    registerPsychologistBodySchema.parse(request.body)

  const registerPsychologistUseCase = container.resolve(
    RegisterPsychologistUseCase,
  )

  const result = await registerPsychologistUseCase.execute({
    fullName,
    email,
    password,
    dateOfBirth,
    phone,
    crp,
  })

  if (result.isFailure()) {
    throw result.value
  }

  return reply.status(201).send()
}
