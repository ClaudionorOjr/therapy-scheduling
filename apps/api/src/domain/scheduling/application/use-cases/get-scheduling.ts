import { type Either, failure, success } from '@core/either'
import type { Scheduling } from '@domain/scheduling/enterprise/entities/scheduling'

import type { SchedulingsRepository } from '../repositories/schedulings-repository'

interface GetSchedulingUseCaseRequest {
  psychologistId: string
  schedulingId: string
}

type GetSchedulingUseCaseResponse = Either<Error, { scheduling: Scheduling }>

export class GetSchedulingUseCase {
  constructor(private schedulingsRepository: SchedulingsRepository) {}
  async execute({
    psychologistId,
    schedulingId,
  }: GetSchedulingUseCaseRequest): Promise<GetSchedulingUseCaseResponse> {
    const scheduling = await this.schedulingsRepository.findById(schedulingId)

    if (!scheduling) {
      return failure(new Error('Scheduling not found.'))
    }

    if (scheduling.psychologistId !== psychologistId) {
      return failure(new Error('Psychologist not assigned to scheduling.'))
    }

    return success({ scheduling })
  }
}
