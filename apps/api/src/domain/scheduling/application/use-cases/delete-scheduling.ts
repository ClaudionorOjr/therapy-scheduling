import { type Either, failure, success } from '@core/either'
import type { PsychologistsRepository } from '@domain/account/application/repositories/psychologists-repository'

import type { SchedulingsRepository } from '../repositories/schedulings-repository'

interface DeleteSchedulingUseCaseRequest {
  psychologistId: string
  schedulingId: string
}

type DeleteSchedulingUseCaseResponse = Either<Error, object>

export class DeleteSchedulingUseCase {
  constructor(
    private schedulingsRepository: SchedulingsRepository,
    private psychologistsRepository: PsychologistsRepository,
  ) {}

  async execute({
    psychologistId,
    schedulingId,
  }: DeleteSchedulingUseCaseRequest): Promise<DeleteSchedulingUseCaseResponse> {
    const psychologist =
      await this.psychologistsRepository.findById(psychologistId)

    if (!psychologist) {
      return failure(new Error('Psychologist not found.'))
    }

    const scheduling = await this.schedulingsRepository.findById(schedulingId)

    if (!scheduling) {
      return failure(new Error('Scheduling not found.'))
    }

    if (scheduling.psychologistId !== psychologistId) {
      return failure(new Error('Psychologist not assigned to scheduling.'))
    }

    await this.schedulingsRepository.delete(schedulingId)

    return success({})
  }
}
