import { type Either, success } from '@core/either'
import type { Scheduling } from '@domain/scheduling/enterprise/entities/scheduling'

import type { SchedulingsRepository } from '../repositories/schedulings-repository'

interface FetchSchedulingsUseCaseRequest {
  psychologistId: string
  patientId?: string
  startDate?: Date
  endDate?: Date
}

type FetchSchedulingsUseCaseResponse = Either<
  Error,
  {
    schedulings: Scheduling[]
  }
>

export class FetchSchedulingsUseCase {
  constructor(private schedulingsRepository: SchedulingsRepository) {}

  async execute({
    psychologistId,
    patientId,
    startDate,
    endDate,
  }: FetchSchedulingsUseCaseRequest): Promise<FetchSchedulingsUseCaseResponse> {
    const schedulings =
      await this.schedulingsRepository.findManyByPsychologistId(
        psychologistId,
        { patientId, startDate, endDate },
      )

    return success({ schedulings })
  }
}
