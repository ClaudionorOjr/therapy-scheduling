import { DeleteAccountUseCase } from '@domain/account/application/use-cases/delete-account'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

export async function deleteAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteAccountUseCase = container.resolve(DeleteAccountUseCase)

  const { sub: psychologistId } = request.user

  const result = await deleteAccountUseCase.execute({ psychologistId })

  if (result.isFailure()) {
    throw result.value
  }

  return reply.status(204).send()
}
