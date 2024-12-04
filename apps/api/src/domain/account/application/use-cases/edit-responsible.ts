import { type Either, failure, success } from '@core/either'

import type { PatientsRepository } from '../repositories/patients-repository'
import type { ResponsiblesRepository } from '../repositories/responsibles-repository'

export interface EditResponsibleUseCaseRequest {
  psychologistId: string
  responsibleId: string
  fullName?: string
  email?: string
  phone?: string
  degreeOfKinship?: string
}

type EditResponsibleUseCaseResponse = Either<Error, object>

export class EditResponsibleUseCase {
  constructor(
    private responsiblesRepository: ResponsiblesRepository,
    private patientsRepository: PatientsRepository,
  ) {}

  async execute({
    psychologistId,
    responsibleId,
    fullName,
    email,
    phone,
    degreeOfKinship,
  }: EditResponsibleUseCaseRequest): Promise<EditResponsibleUseCaseResponse> {
    const responsible =
      await this.responsiblesRepository.findById(responsibleId)

    if (!responsible) {
      return failure(new Error('Responsible not found.'))
    }

    const patient = await this.patientsRepository.findById(
      responsible.patientId,
    )

    if (patient?.psychologistId !== psychologistId) {
      return failure(new Error('Not allowed.'))
    }

    responsible.fullName = fullName ?? responsible.fullName
    responsible.email = email ?? responsible.email
    responsible.phone = phone ?? responsible.phone
    responsible.degreeOfKinship = degreeOfKinship ?? responsible.degreeOfKinship

    return success({})
  }
}
