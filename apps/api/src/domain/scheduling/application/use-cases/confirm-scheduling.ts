import { type Either, failure, success } from '@core/either'

import type { SchedulingsRepository } from '../repositories/schedulings-repository'

interface ConfirmSchedulingUseCaseRequest {
  schedulingId: string
}

type ConfirmSchedulingUseCaseResponse = Either<Error, object>

export class ConfirmSchedulingUseCase {
  constructor(private schedulingsRepository: SchedulingsRepository) {}
  async execute({
    schedulingId,
  }: ConfirmSchedulingUseCaseRequest): Promise<ConfirmSchedulingUseCaseResponse> {
    // TODO: adicionar um código de verificação para validar o usuário que está confirmando

    const scheduling = await this.schedulingsRepository.findById(schedulingId)

    if (!scheduling) {
      return failure(new Error('Scheduling not found.'))
    }

    if (scheduling.status === 'CONFIRMED') {
      return failure(new Error('Scheduling already confirmed.'))
    }

    scheduling.confirm()

    await this.schedulingsRepository.save(scheduling)

    return success({})
  }
}
