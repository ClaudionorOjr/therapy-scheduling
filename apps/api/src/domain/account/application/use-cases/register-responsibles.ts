import { type Either, failure, success } from '@core/either'
import { Responsible } from '@domain/account/enterprise/entities/responsible'
import { inject, injectable } from 'tsyringe'

import type { PatientsRepository } from '../repositories/patients-repository'
import type { ResponsiblesRepository } from '../repositories/responsibles-repository'

export type ResponsibleRequest = Omit<Responsible, 'id' | 'patientId'>

export interface RegisterResponsiblesUseCaseRequest {
  psychologistId: string
  patientId: string
  responsibles: ResponsibleRequest[]
}

type RegisterResponsiblesUseCaseResponse = Either<Error, object>

@injectable()
export class RegisterResponsiblesUseCase {
  constructor(
    @inject('ResponsiblesRepository')
    private responsiblesRepository: ResponsiblesRepository,
    @inject('PatientsRepository')
    private patientsRepository: PatientsRepository,
  ) {}

  async execute({
    psychologistId,
    patientId,
    responsibles: responsiblesRequest,
  }: RegisterResponsiblesUseCaseRequest): Promise<RegisterResponsiblesUseCaseResponse> {
    const patient = await this.patientsRepository.findById(patientId)

    if (!patient) {
      return failure(new Error('Patient not found.'))
    }

    if (patient.psychologistId !== psychologistId) {
      return failure(new Error('Not allowed.'))
    }

    const responsibles = responsiblesRequest.map((responsible) => {
      return Responsible.create({
        ...responsible,
        patientId,
      })
    })

    await this.responsiblesRepository.createMany(responsibles)

    return success({})
  }
}
