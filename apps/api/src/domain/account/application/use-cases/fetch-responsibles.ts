import { type Either, success } from '@core/either'
import type { Responsible } from '@domain/account/enterprise/entities/responsible'

import type { ResponsiblesRepository } from '../repositories/responsibles-repository'

interface FetchResponsiblesUseCaseRequest {
  patientId: string
}

type FetchResponsiblesUseCaseResponse = Either<
  null,
  { responsibles: Responsible[] }
>

export class FetchResponsiblesUseCase {
  constructor(private responsiblesRepository: ResponsiblesRepository) {}

  async execute({
    patientId,
  }: FetchResponsiblesUseCaseRequest): Promise<FetchResponsiblesUseCaseResponse> {
    const responsibles =
      await this.responsiblesRepository.findManyByPatientId(patientId)

    return success({ responsibles })
  }
}
