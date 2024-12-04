import { EditPsychologistUseCase } from '@domain/account/application/use-cases/edit-psychologist'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function editPsychologist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const editPsychologistBodySchema = z.object({
    fullName: z.string().optional(),
    phone: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
  })

  const { fullName, phone, dateOfBirth } = editPsychologistBodySchema.parse(
    request.body,
  )

  const { sub } = request.user

  const editPsychologistUseCase = container.resolve(EditPsychologistUseCase)

  const result = await editPsychologistUseCase.execute({
    psychologistId: sub,
    fullName,
    phone,
    dateOfBirth,
  })

  if (result.isFailure()) {
    throw result.value
  }

  return reply.status(204).send()
}
