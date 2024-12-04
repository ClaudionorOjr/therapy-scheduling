import { type Either, failure, success } from '@core/either'

import type { SchedulingsRepository } from '../repositories/schedulings-repository'

interface ReschedulingUseCaseRequest {
  schedulingId: string
}

type ReschedulingUseCaseResponse = Either<Error, object>

export class ReschedulingUseCase {
  constructor(private schedulingsRepository: SchedulingsRepository) {}
  async execute({
    schedulingId,
  }: ReschedulingUseCaseRequest): Promise<ReschedulingUseCaseResponse> {
    const scheduling = await this.schedulingsRepository.findById(schedulingId)

    if (!scheduling) {
      return failure(new Error('Scheduling not found.'))
    }

    if (scheduling.status === 'RESCHEDULING') {
      return failure(new Error('Scheduling already rescheduling.'))
    }

    scheduling.reschedule()

    await this.schedulingsRepository.save(scheduling)

    // TODO: notificar psicólogo sobre reagendamento

    return success({})
  }
}
