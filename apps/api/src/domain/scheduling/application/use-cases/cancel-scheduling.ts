import { type Either, failure, success } from '@core/either'

import type { SchedulingsRepository } from '../repositories/schedulings-repository'

interface CancelSchedulingUseCaseRequest {
  schedulingId: string
}

type CancelSchedulingUseCaseResponse = Either<Error, object>

export class CancelSchedulingUseCase {
  constructor(private schedulingsRepository: SchedulingsRepository) {}
  async execute({
    schedulingId,
  }: CancelSchedulingUseCaseRequest): Promise<CancelSchedulingUseCaseResponse> {
    const scheduling = await this.schedulingsRepository.findById(schedulingId)

    if (!scheduling) {
      return failure(new Error('Scheduling not found.'))
    }

    if (scheduling.status === 'CANCELED') {
      return failure(new Error('Scheduling already canceled.'))
    }

    scheduling.cancel()

    await this.schedulingsRepository.save(scheduling)

    return success({})
  }
}
