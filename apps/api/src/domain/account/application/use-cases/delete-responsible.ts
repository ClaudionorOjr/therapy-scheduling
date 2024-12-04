import { type Either, failure, success } from '@core/either'

import type { PatientsRepository } from '../repositories/patients-repository'
import type { ResponsiblesRepository } from '../repositories/responsibles-repository'

interface DeleteResponsibleUseCaseRequest {
  responsibleId: string
  psychologistId: string
}

type DeleteResponsibleUseCaseReponse = Either<Error, object>

export class DeleteResponsibleUseCase {
  constructor(
    private patientsRepository: PatientsRepository,
    private responsilesRepository: ResponsiblesRepository,
  ) {}

  async execute({
    responsibleId,
    psychologistId,
  }: DeleteResponsibleUseCaseRequest): Promise<DeleteResponsibleUseCaseReponse> {
    const responsible = await this.responsilesRepository.findById(responsibleId)

    if (!responsible) {
      return failure(new Error('Responsible not found.'))
    }

    const patient = await this.patientsRepository.findById(
      responsible.patientId,
    )

    if (patient?.psychologistId !== psychologistId) {
      return failure(new Error('Not allowed.'))
    }

    await this.responsilesRepository.delete(responsibleId)

    return success({})
  }
}
