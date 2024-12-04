import { AuthenticateUseCase } from '@domain/account/application/use-cases/authenticate'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  const authenticateUseCase = container.resolve(AuthenticateUseCase)

  const result = await authenticateUseCase.execute({
    email,
    password,
  })

  if (result.isFailure()) {
    throw result.value
  }

  const { accessToken } = result.value

  return reply.status(200).send({ accessToken })
}
