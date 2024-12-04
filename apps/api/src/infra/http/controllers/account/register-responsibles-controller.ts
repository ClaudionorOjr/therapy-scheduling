import { RegisterResponsiblesUseCase } from '@domain/account/application/use-cases/register-responsibles'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function registerResponsibles(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerResponsiblesBodySchema = z.object({
    responsibles: z.array(
      z.object({
        fullName: z.string(),
        email: z.string(),
        phone: z.string(),
        degreeOfKinship: z.string(),
      }),
    ),
  })

  const registerResponsiblesParamsSchema = z.object({
    patientId: z.string().uuid(),
  })

  const { responsibles } = registerResponsiblesBodySchema.parse(request.body)

  const { patientId } = registerResponsiblesParamsSchema.parse(request.params)

  const { sub: psychologistId } = request.user

  const registerResponsiblesUseCase = container.resolve(
    RegisterResponsiblesUseCase,
  )

  const result = await registerResponsiblesUseCase.execute({
    psychologistId,
    patientId,
    responsibles,
  })

  if (result.isFailure()) {
    throw result.value
  }

  return reply.status(201).send()
}
